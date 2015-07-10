using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Jasmine.Suites {

    public class ReorderListItem {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
    }

    public class ReorderListItems {

        public static List<ReorderListItem> Items = new List<ReorderListItem>() {
            new ReorderListItem() {
                ID = 0,
                Title = "First title",
                Description = "First description",
                Priority = 0
            },
            new ReorderListItem() {
                ID = 1,
                Title = "Second title",
                Description = "Second description",
                Priority = 1
            },
            new ReorderListItem() {
                ID = 2,
                Title = "Third title",
                Description = "Third description",
                Priority = 2
            }
        };

        public List<ReorderListItem> GetItems() {
            return Items;
        }

        public void InsertItem(string title, int priority) {
            if(String.IsNullOrEmpty(title))
                return;

            var item = new ReorderListItem() {
                ID = Items[Items.Count - 1].ID + 1,
                Title = title,
                Description = "Additional description",
                Priority = Items[Items.Count - 1].Priority + 1
            };

            Items.Add(item);
        }

        public void UpdateItem(string title, string description, int priority, int id) {
            var item = Items.First(i => i.ID == id);
            item.Priority = priority;
        }
    }
}
