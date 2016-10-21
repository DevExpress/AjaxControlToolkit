using System.Collections.Generic;

public class Markup {
    public string CodeBlockID { get; set; }
    public string Language { get; set; }
    public ICollection<string> Lines { get; set; }

    public Markup() {
        Lines = new List<string>();
        Language = "aspx";
    }

}