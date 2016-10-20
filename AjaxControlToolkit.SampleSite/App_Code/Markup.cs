using System.Collections.Generic;

public class Markup {
    public string CodeBlockID { get; set; }
    public ICollection<string> Lines { get; set; }

    public Markup() {
        Lines = new List<string>();
    }

}