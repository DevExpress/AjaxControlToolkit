using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Web.Script.Serialization;

namespace AjaxControlToolkit {
    // The AnimationJavaScriptConverter is used to convert Animation objects to and from a
    // representation understood by the JavaScriptSerializer.  We cannot rely on the
    // JavaScriptSerializer's default conversion because our JSON is expected to be in a
    // specific format.
    internal class AnimationJavaScriptConverter : JavaScriptConverter {
        public override IEnumerable<Type> SupportedTypes {
            get { return new ReadOnlyCollection<Type>(new List<Type>(new Type[] { typeof(Animation) })); }
        }

        // Convert an Animation to a representation understood by the JavaScriptSerializer
        public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer) {
            var animation = obj as Animation;
            if(animation != null)
                return Serialize(animation);

            return new Dictionary<string, object>();
        }

        // Recursively convert an Animation to a representation understood by the JavaScriptSerializer
        static IDictionary<string, object> Serialize(Animation animation) {
            if(animation == null)
                throw new ArgumentNullException("animation");

            // Create the representation
            var obj = new Dictionary<string, object>();
            obj["AnimationName"] = animation.Name;

            // Add the properties
            foreach(var pair in animation.Properties)
                obj[pair.Key] = pair.Value;

            // Recursively add the children
            var children = new List<IDictionary<string, object>>();
            foreach(var child in animation.Children)
                children.Add(Serialize(child));

            obj["AnimationChildren"] = children.ToArray();
            
            return obj;
        }

        // Convert the JavaScriptSerializer's representation into an Animation
        // type should be Animation or derived class
        public override object Deserialize(IDictionary<string, object> dictionary, Type t, JavaScriptSerializer serializer) {
            if(dictionary == null)
                throw new ArgumentNullException("dictionary");

            if(t == typeof(Animation) || t.IsSubclassOf(typeof(Animation)))
                return Deserialize(dictionary);
            
            return null;
        }

        // Recursively convert the JavaScriptSerializer's representation into an Animation
        static Animation Deserialize(IDictionary<string, object> obj) {
            if(obj == null)
                throw new ArgumentNullException("obj");

            var animation = new Animation();

            if(!obj.ContainsKey("AnimationName"))
                throw new InvalidOperationException("Cannot deserialize an Animation without an AnimationName property");

            animation.Name = obj["AnimationName"] as string;

            // Deserialize the animation's properties (ignoring any special properties)
            foreach(var pair in obj) {
                if(String.Compare(pair.Key, "AnimationName", StringComparison.OrdinalIgnoreCase) != 0 &&
                    String.Compare(pair.Key, "AnimationChildren", StringComparison.OrdinalIgnoreCase) != 0)
                    animation.Properties.Add(pair.Key, pair.Value != null ? pair.Value.ToString() : null);
            }

            if(obj.ContainsKey("AnimationChildren")) {
                var children = obj["AnimationChildren"] as ArrayList;
                if(children != null)
                    foreach(var c in children) {
                        var child = c as IDictionary<string, object>;
                        if(child != null)
                            animation.Children.Add(Deserialize(child));
                    }
            }

            return animation;
        }
    }

}
