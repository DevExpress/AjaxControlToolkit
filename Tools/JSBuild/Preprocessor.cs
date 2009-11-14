using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Text.RegularExpressions;
using System.Collections;
using Microsoft.Build.Utilities;

namespace JSBuild {
    public class Preprocessor {

        private bool _writeRelease = true;
        private bool _writeDebug = true;
        private string _line = String.Empty;
        private int _lineNumber = 0;
        private Stack<StackFrame> _stack = new Stack<StackFrame>();
        private IList<string> _symbols;

        public Preprocessor()
            : this(null) {
        }

        public Preprocessor(IList<string> symbols)
            : this(symbols, true, true) {
        }

        public Preprocessor(IList<string> symbols, bool debug, bool release) {
            _symbols = symbols ?? new List<String>();
            _writeDebug = debug;
            _writeRelease = release;
        }

        public void Process(string sourcePath, TextReader sourceReader, TextWriter debugWriter, TextWriter releaseWriter) {
            using (sourceReader) {
                while ((_line = sourceReader.ReadLine()) != null) {
                    _lineNumber++;
                    if (IsDirective(_line)) {
                        var directive = new Directive(_lineNumber, _line);

                        switch (directive.Command) {
                            case "IF":
                                ProcessIFDirective(directive);
                                break;
                            case "ELSE":
                                ProcessELSEDirective(directive);
                                break;
                            case "ENDIF":
                                ProcessENDIFDirective(directive);
                                break;
                            case "INCLUDE":
                                ProcessINCLUDEDirective(sourcePath, directive, debugWriter, releaseWriter);
                                break;
                            case "DEFINE":
                                ProcessDEFINEDirective(directive, false);
                                break;
                            case "UNDEFINE":
                                ProcessDEFINEDirective(directive, true);
                                break;
                            default:
                                var errorMessage = "Unknown directive " + directive.Command;
                                throw new Exception(errorMessage);
                        }

                    }
                    else {
                        if (_writeDebug) {
                            debugWriter.WriteLine(_line);
                        }

                        if (_writeRelease) {
                            releaseWriter.WriteLine(_line);
                        }
                    }
                }
            }

        }

        protected void ProcessDEFINEDirective(Directive directive, bool remove) {
            foreach (string parameter in directive.Parameters) {
                if (remove) {
                    _symbols.Remove(parameter);
                }
                else {
                    _symbols.Add(parameter);
                }
            }
        }

        protected void ProcessIFDirective(Directive directive) {
            var parameter = directive.Parameters[0].ToUpperInvariant();
            if (String.IsNullOrEmpty(parameter)) {
                ThrowProcessingError("Invalid #IF parameter");
            }

            // Add current state to stack 
            _stack.Push(new StackFrame(directive, _writeDebug, _writeRelease));

            // Process IF
            switch (parameter) {
                case "DEBUG":
                    _writeDebug = true;
                    _writeRelease = false;
                    break;
                case "RELEASE":
                    _writeDebug = false;
                    _writeRelease = true;
                    break;
                default:
                    if (IsSymbolDefined(parameter)) {
                        _writeDebug = true;
                        _writeRelease = true;
                    }
                    else {
                        _writeDebug = false;
                        _writeRelease = false;
                    }
                    break;
            }

        }

        protected void ProcessELSEDirective(Directive directive) {
            _writeDebug = !_writeDebug;
            _writeRelease = !_writeRelease;
        }



        protected void ProcessENDIFDirective(Directive directive) {
            if (_stack.Count == 0) {
                ThrowProcessingError("#ENDIF without #IF");
            }

            var frame = _stack.Pop();
            _writeDebug = frame.WriteDebug;
            _writeRelease = frame.WriteRelease;
        }


        protected void ProcessINCLUDEDirective(string sourcePath, Directive directive, TextWriter debugWriter, TextWriter releaseWriter) {
            var includeFile = directive.Parameters[0];
            if (String.IsNullOrEmpty(includeFile)) {
                ThrowProcessingError("#INCLUDE missing include file ");
            }

            // Recurse
            string includePath = Path.Combine(Path.GetDirectoryName(sourcePath), includeFile);
            var includeReader = new StreamReader(includePath);
            var includePreprocessor = new Preprocessor(_symbols, _writeDebug, _writeRelease);
            includePreprocessor.Process(includePath, includeReader, debugWriter, releaseWriter);
        }


        public static bool IsDirective(string line) {
            return line.TrimStart().StartsWith("//#") || line.TrimStart().StartsWith("#");
        }


        public bool IsSymbolDefined(string symbol) {
            return _symbols.Contains(symbol, StringComparer.OrdinalIgnoreCase);
        }


        private void ThrowProcessingError(string message) {
            var errorMessage = String.Format("{0} on line {1}:{2}.", message, _lineNumber, _line);
            throw new Exception(errorMessage);
        }


    }
}
