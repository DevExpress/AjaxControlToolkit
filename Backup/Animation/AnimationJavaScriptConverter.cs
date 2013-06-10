

using System;
using System.Collections;
using System.Collections.ObjectModel;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace AjaxControlToolkit
{
    /// <summary>
    /// The AnimationJavaScriptConverter is used to convert Animation objects to and from a
    /// representation understood by the JavaScriptSerializer.  We cannot rely on the
    /// JavaScriptSerializer's default conversion because our JSON is expected to be in a
    /// specific format.
    /// </summary>
    internal class AnimationJavaScriptConverter : JavaScriptConverter
    {
        /// <summary>
        /// Animation is the only type this converter can be used on
        /// </summary>
        public override IEnumerable<Type> SupportedTypes
        {
            get { return new ReadOnlyCollection<Type>(new List<Type>(new Type[] { typeof(Animation) })); }
        }

        /// <summary>
        /// Convert an Animation to a representation understood by the JavaScriptSerializer
        /// </summary>
        /// <param name="obj">Object to convert</param>
        /// <param name="serializer">Serializer</param>
        /// <returns>Converted representation of the Animation</returns>
        public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
        {
            Animation animation = obj as Animation;
            if (animation != null)
                return Serialize(animation);
            return new Dictionary<string, object>();
        }

        /// <summary>
        /// Recursively onvert an Animation to a representation understood by the JavaScriptSerializer
        /// </summary>
        /// <param name="animation">Animation</param>
        /// <returns>Converted representation of the Animation</returns>
        private static IDictionary<string, object> Serialize(Animation animation)
        {
            if (animation == null)
                throw new ArgumentNullException("animation");

            // Create the representation
            Dictionary<string, object> obj = new Dictionary<string, object>();
            obj["AnimationName"] = animation.Name;

            // Add the properties
            foreach (KeyValuePair<string, string> pair in animation.Properties)
                obj[pair.Key] = pair.Value;

            // Recursively add the children
            List<IDictionary<string, object>> children = new List<IDictionary<string, object>>();
            foreach (Animation child in animation.Children)
                children.Add(Serialize(child));
            obj["AnimationChildren"] = children.ToArray();
            
            return obj;
        }

        /// <summary>
        /// Convert the JavaScriptSerializer's representation into an Animation
        /// </summary>
        /// <param name="dictionary">Representation of the Animation</param>
        /// <param name="t">Type to deserialize (should be Animation or derived class)</param>
        /// <param name="serializer">Serializer</param>
        /// <returns>Animation</returns>
        public override object Deserialize(IDictionary<string, object> dictionary, Type t, JavaScriptSerializer serializer)
        {
            if (dictionary == null)
                throw new ArgumentNullException("dictionary");

            if (t == typeof(Animation) || t.IsSubclassOf(typeof(Animation)))
                return Deserialize(dictionary);
            return null;
        }

        /// <summary>
        /// Recursively convert the JavaScriptSerializer's representation into an Animation
        /// </summary>
        /// <param name="obj">Representation of the Animation</param>
        /// <returns>Animation</returns>
        private static Animation Deserialize(IDictionary<string, object> obj)
        {
            if (obj == null)
                throw new ArgumentNullException("obj");

            // Create the instance to deserialize into
            Animation animation = new Animation();

            // Get the animation's name
            if (!obj.ContainsKey("AnimationName"))
                throw new InvalidOperationException("Cannot deserialize an Animation without an AnimationName property");
            animation.Name = obj["AnimationName"] as string;

            // Deserialize the animation's properties (ignoring any special properties)
            foreach (KeyValuePair<string, object> pair in obj)
            {
                if (string.Compare(pair.Key, "AnimationName", StringComparison.OrdinalIgnoreCase) != 0 &&
                    string.Compare(pair.Key, "AnimationChildren", StringComparison.OrdinalIgnoreCase) != 0)
                    animation.Properties.Add(pair.Key, pair.Value != null ? pair.Value.ToString() : null);
            }

            // Get any children and recursively deserialize them
            if (obj.ContainsKey("AnimationChildren"))
            {
                ArrayList children = obj["AnimationChildren"] as ArrayList;
                if (children != null)
                    foreach (object c in children)
                    {
                        IDictionary<string, object> child = c as IDictionary<string, object>;
                        if (c != null)
                            animation.Children.Add(Deserialize(child));
                    }
            }

            return animation;
        }
    }
}