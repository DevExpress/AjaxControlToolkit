using System.Web.UI.WebControls;

namespace CustomValidators
{
    /// <summary>
    /// Implementation of a simple server-side validator.
    /// </summary>
    public class ServerValidator : CustomValidator
    {
        /// <summary>
        /// Constructs a new ServerValidator.
        /// </summary>
        public ServerValidator()
        {
            ValidateEmptyText = true;
        }

        /// <summary>
        /// Overrides OnServerValidate to implement custom logic.
        /// </summary>
        /// <param name="value">The value to validate.</param>
        /// <returns>true if the value specified by the value parameter passes validation; otherwise, false.</returns>
        protected override bool OnServerValidate(string value)
        {
            return "1" == value;
        }
    }
}
