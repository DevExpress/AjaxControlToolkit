namespace JSBuild {
    using System;
    using System.Collections.Generic;
    using System.Text.RegularExpressions;

    public class Directive {
        private string _command;
        private List<string> _parameters = new List<string>();

        public Directive(int lineNumber, string line) {
            // Match command
            var commandMatch = Regex.Match(line, @"(//)?#(?<command>\S+)(?<parameters>.*)");
            if (!commandMatch.Success) {
                var errorMessage = String.Format("Could not match directive on line {0}:{1}.", lineNumber, line);
                throw new Exception(errorMessage);
            }
            var command = commandMatch.Groups["command"].Value;
            _command = command.ToUpperInvariant();

            // Match parameters
            string parameters = commandMatch.Groups["parameters"].Value;
            ParseParameters(parameters);
        }

        private void ParseParameters(string parameters) {
            var parameterLine = parameters.Trim();
            var currentParameter = String.Empty;
            var inQuote = false;
            foreach (char c in parameterLine) {
                if (c == '"' || c == '\'') {
                    inQuote = !inQuote;
                    continue;
                }

                if (char.IsWhiteSpace(c) && !inQuote) {
                    _parameters.Add(currentParameter.Trim());
                    currentParameter = String.Empty;
                    continue;
                }

                currentParameter += c;
            }

            if (!String.IsNullOrEmpty(currentParameter)) {
                _parameters.Add(currentParameter);
            }
        }

        public string Command {
            get {
                return _command;
            }
        }

        public List<string> Parameters {
            get { return _parameters; }
        }
    }
}
