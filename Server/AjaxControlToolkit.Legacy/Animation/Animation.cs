

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Web;
using System.Web.UI;
using System.Xml;
using System.Web.Script.Serialization;

namespace AjaxControlToolkit
{
    /// <summary>
    /// The Animation class is an object model for the animations used in the Ajax Control Toolkit.
    /// It is used primarily as an intermediate representation when converting from XML animation
    /// descriptions to JSON objects, but it can also be used to dynamically create and manipulate
    /// animations.
    /// </summary>
    [ParseChildren(true)]
    [PersistChildren(false)]
    [DefaultProperty("Name")]
    public class Animation
    {
        // JavaScript serializer to read/write JSON animations descriptions
        private static JavaScriptSerializer _serializer;

        // Name of the animation
        private string _name;

        // List of child animations
        private List<Animation> _children;

        // Properties defined for the animation
        private Dictionary<string, string> _properties;

        /// <summary>
        /// Static constructor to setup our serializer
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1810:InitializeReferenceTypeStaticFieldsInline", Justification = "Call to RegisterConverters can not be moved inline")]
        static Animation()
        {
            _serializer = new JavaScriptSerializer();
            _serializer.RegisterConverters(new JavaScriptConverter[] { new AnimationJavaScriptConverter() });
        }

        /// <summary>
        /// Default constructor
        /// </summary>
        public Animation()
        {
            _children = new List<Animation>();
            _properties = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Name of the animation (this corresponds to the tag name of the XML
        /// description, or the AnimationName property of the JSON description) that
        /// matches the name of a registered animation (i.e. this must match one of
        /// the names provided on the client in a call to
        /// Sys.Extended.UI.Animation.registerAnimation('name', type);).
        /// </summary>
        [Browsable(false)]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        /// <summary>
        /// List of child animations (this corresponds to any child elements in the XML
        /// description, or the AnimationChildren array in the JSON description), which
        /// should only be needed for animations inheriting from SequenceAnimation or
        /// CompositeAnimation.
        /// </summary>
        [Browsable(false)]
        public IList<Animation> Children
        {
            get { return _children; }
        }

        /// <summary>
        /// Properties defined for the animation (this corresponds to any of the
        /// attributes in the XML description, or any of the members in the JSON
        /// description), which specify all the necessary parameters of the animation.
        /// </summary>
        [Browsable(false)]
        public Dictionary<string, string> Properties
        {
            get { return _properties; }
        }

        /// <summary>
        /// Convert the animation into its JSON description
        /// </summary>
        /// <returns>JSON description of the animation</returns>
        public override string ToString()
        {
            return Animation.Serialize(this);
        }

        /// <summary>
        /// Convert an animation into its JSON description
        /// </summary>
        /// <param name="animation">Animation to convert</param>
        /// <returns>JSON description of the animation</returns>
        public static string Serialize(Animation animation)
        {
            return _serializer.Serialize(animation);
        }

        /// <summary>
        /// Convert a JSON animation description into an Animation object.
        /// </summary>
        /// <param name="json">JSON animation description</param>
        /// <returns>Animation</returns>
        [SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "json", Justification = "JSON is an acronym")]
        public static Animation Deserialize(string json)
        {
            if (string.IsNullOrEmpty(json))
                return null;

            return _serializer.Deserialize<Animation>(json);
        }

        /// <summary>
        /// Convert an XML animation description into an Animation object
        /// </summary>
        /// <param name="node">Node in an XmlDocument to deserialize</param>
        /// <returns>Deserialized animation</returns>
        [SuppressMessage("Microsoft.Design", "CA1059:MembersShouldNotExposeCertainConcreteTypes", MessageId = "System.Xml.XmlNode", Justification = "XmlNode is specific to the design")]
        public static Animation Deserialize(XmlNode node)
        {
            if (node == null)
                throw new ArgumentNullException("node");

            // Create the new animation
            Animation animation = new Animation();
            animation.Name = node.Name;

            // Set the properties of the animation
            foreach (XmlAttribute attribute in node.Attributes)
                animation.Properties.Add(attribute.Name, attribute.Value);

            // Add any children (recursively)
            if (node.HasChildNodes)
                foreach (XmlNode child in node.ChildNodes)
                    animation.Children.Add(Animation.Deserialize(child));

            return animation;
        }

        /// <summary>
        /// Convert a series of XML animation descriptions into Animations and assign them to their corresponding
        /// Animation properties on a provided ExtenderControl instance.  This will most likely be called by
        /// AnimationExtenderControlBase.Animations, but it is publicly exposed so you can call it in the event
        /// your extender cannot inherit from AnimationExtenderControlBase.
        /// </summary>
        /// <param name="value">
        /// Sequence of XML animation descriptions (i.e. there should not be a root node because it's expecting the
        /// inner contents of the &lt;Animations&gt; tag)
        /// </param>
        /// <param name="targetProperties">Target properties that contains the corresponding Animations</param>
        public static void Parse(string value, ExtenderControl extenderControl)
        {
            if (extenderControl == null)
                throw new ArgumentNullException("extenderControl");
            if (value == null || string.IsNullOrEmpty(value.Trim()))
                return;

            // Wrap the XML in a root node (because the Animations node
            // isn't included in the content
            value = "<Animations>" + value + "</Animations>";

            // Parse the animation descriptions
            XmlDocument xml = new XmlDocument();
            using (XmlTextReader reader = new XmlTextReader(new StringReader(value)))
            {
                try { xml.Load(reader); }
                catch (XmlException ex)
                {
                    string message = string.Format(CultureInfo.CurrentCulture,
                        "Invalid Animation definition for TargetControlID=\"{0}\": {1}",
                        extenderControl.TargetControlID, ex.Message);
                    throw new HttpParseException(message, new ArgumentException(message, ex),
                        HttpContext.Current.Request.Path, value, ex.LineNumber);
                }
            }

            // Create animations for each of the Nodes
            foreach (XmlNode node in xml.DocumentElement.ChildNodes)
            {
                // Get the animation's corresponding property
                PropertyDescriptor animationProperty = TypeDescriptor.GetProperties(extenderControl)[node.Name];
                if (animationProperty == null || animationProperty.IsReadOnly)
                {
                    string message = string.Format(CultureInfo.CurrentCulture,
                        "Animation on TargetControlID=\"{0}\" uses property {1}.{2} that does not exist or cannot be set",
                        extenderControl.TargetControlID, extenderControl.GetType().FullName, node.Name);
                    throw new HttpParseException(message, new ArgumentException(message),
                        HttpContext.Current.Request.Path, value, GetLineNumber(value, node.Name));
                }

                // Create the animation
                if (node.ChildNodes.Count != 1)
                {
                    string message = string.Format(CultureInfo.CurrentCulture,
                        "Animation {0} for TargetControlID=\"{1}\" can only have one child node.",
                        node.Name, extenderControl.TargetControlID);
                    throw new HttpParseException(message, new ArgumentException(message),
                        HttpContext.Current.Request.Path, value, GetLineNumber(value, node.Name));
                }
                XmlNode child = node.ChildNodes[0];
                Animation animation = Animation.Deserialize(child);

                // Assign the animation to its property
                animationProperty.SetValue(extenderControl, animation);
            }
        }

        /// <summary>
        /// GetLineNumber is used when reporting errors in Animation XML
        /// descriptions. It will find the line number of the first top level
        /// node whose tag matches the provided value.
        /// </summary>
        /// <param name="source">Animation XML description</param>
        /// <param name="tag">Tag of the node to find</param>
        /// <returns>Line number of the tag, or the first line if nothing found</returns>
        private static int GetLineNumber(string source, string tag)
        {
            // We'll manually walk through the source using an XmlTextReader
            // so we can get the line number
            using (XmlTextReader reader = new XmlTextReader(new StringReader(source)))
            {
                // Move to the document element
                if (reader.Read())
                {
                    // Loop though all the top level children
                    while (reader.Read())
                    {
                        // If this node matches, return its line number
                        if (string.Compare(reader.Name, tag, StringComparison.OrdinalIgnoreCase) == 0)
                            return reader.LineNumber;
                        // If this node has children, ignore them all 
                        if (reader.NodeType == XmlNodeType.Element && !reader.IsEmptyElement)
                            reader.Skip();
                    }
                }
            }

            // If we can't find it, just use the first line
            return 1;   
        }
    }
}