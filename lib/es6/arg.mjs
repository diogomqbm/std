

import * as Sys from "./sys.mjs";
import * as List from "./list.mjs";
import * as $$Array from "./array.mjs";
import * as Curry from "./curry.mjs";
import * as $$Buffer from "./buffer.mjs";
import * as Printf from "./printf.mjs";
import * as $$String from "./string.mjs";
import * as Caml_io from "./caml_io.mjs";
import * as Caml_obj from "./caml_obj.mjs";
import * as Caml_array from "./caml_array.mjs";
import * as Pervasives from "./pervasives.mjs";
import * as Caml_format from "./caml_format.mjs";
import * as Caml_string from "./caml_string.mjs";
import * as Caml_primitive from "./caml_primitive.mjs";
import * as Caml_exceptions from "./caml_exceptions.mjs";
import * as Caml_js_exceptions from "./caml_js_exceptions.mjs";
import * as Caml_external_polyfill from "./caml_external_polyfill.mjs";

var Bad = Caml_exceptions.create("Arg.Bad");

var Help = Caml_exceptions.create("Arg.Help");

var Stop = Caml_exceptions.create("Arg.Stop");

function assoc3(x, _l) {
  while(true) {
    var l = _l;
    if (l) {
      var match = l.hd;
      if (Caml_obj.caml_equal(match[0], x)) {
        return match[1];
      }
      _l = l.tl;
      continue ;
    }
    throw {
          RE_EXN_ID: "Not_found",
          Error: new Error()
        };
  };
}

function split(s) {
  var i = $$String.index(s, /* '=' */61);
  var len = s.length;
  return [
          $$String.sub(s, 0, i),
          $$String.sub(s, i + 1 | 0, len - (i + 1 | 0) | 0)
        ];
}

function make_symlist(prefix, sep, suffix, l) {
  if (l) {
    return List.fold_left((function (x, y) {
                  return x + (sep + y);
                }), prefix + l.hd, l.tl) + suffix;
  } else {
    return "<none>";
  }
}

function help_action(param) {
  throw {
        RE_EXN_ID: Stop,
        _1: {
          TAG: /* Unknown */0,
          _0: "-help"
        },
        Error: new Error()
      };
}

function add_help(speclist) {
  var add1;
  try {
    assoc3("-help", speclist);
    add1 = /* [] */0;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Not_found") {
      add1 = {
        hd: [
          "-help",
          {
            TAG: /* Unit */0,
            _0: help_action
          },
          " Display this list of options"
        ],
        tl: /* [] */0
      };
    } else {
      throw exn;
    }
  }
  var add2;
  try {
    assoc3("--help", speclist);
    add2 = /* [] */0;
  }
  catch (raw_exn$1){
    var exn$1 = Caml_js_exceptions.internalToOCamlException(raw_exn$1);
    if (exn$1.RE_EXN_ID === "Not_found") {
      add2 = {
        hd: [
          "--help",
          {
            TAG: /* Unit */0,
            _0: help_action
          },
          " Display this list of options"
        ],
        tl: /* [] */0
      };
    } else {
      throw exn$1;
    }
  }
  return Pervasives.$at(speclist, Pervasives.$at(add1, add2));
}

function usage_b(buf, speclist, errmsg) {
  Curry._1(Printf.bprintf(buf, /* Format */{
            _0: {
              TAG: /* String */2,
              _0: /* No_padding */0,
              _1: {
                TAG: /* Char_literal */12,
                _0: /* '\n' */10,
                _1: /* End_of_format */0
              }
            },
            _1: "%s\n"
          }), errmsg);
  return List.iter((function (param) {
                var doc = param[2];
                if (doc.length === 0) {
                  return ;
                }
                var spec = param[1];
                var key = param[0];
                if (spec.TAG === /* Symbol */11) {
                  return Curry._3(Printf.bprintf(buf, /* Format */{
                                  _0: {
                                    TAG: /* String_literal */11,
                                    _0: "  ",
                                    _1: {
                                      TAG: /* String */2,
                                      _0: /* No_padding */0,
                                      _1: {
                                        TAG: /* Char_literal */12,
                                        _0: /* ' ' */32,
                                        _1: {
                                          TAG: /* String */2,
                                          _0: /* No_padding */0,
                                          _1: {
                                            TAG: /* String */2,
                                            _0: /* No_padding */0,
                                            _1: {
                                              TAG: /* Char_literal */12,
                                              _0: /* '\n' */10,
                                              _1: /* End_of_format */0
                                            }
                                          }
                                        }
                                      }
                                    }
                                  },
                                  _1: "  %s %s%s\n"
                                }), key, make_symlist("{", "|", "}", spec._0), doc);
                } else {
                  return Curry._2(Printf.bprintf(buf, /* Format */{
                                  _0: {
                                    TAG: /* String_literal */11,
                                    _0: "  ",
                                    _1: {
                                      TAG: /* String */2,
                                      _0: /* No_padding */0,
                                      _1: {
                                        TAG: /* Char_literal */12,
                                        _0: /* ' ' */32,
                                        _1: {
                                          TAG: /* String */2,
                                          _0: /* No_padding */0,
                                          _1: {
                                            TAG: /* Char_literal */12,
                                            _0: /* '\n' */10,
                                            _1: /* End_of_format */0
                                          }
                                        }
                                      }
                                    }
                                  },
                                  _1: "  %s %s\n"
                                }), key, doc);
                }
              }), add_help(speclist));
}

function usage_string(speclist, errmsg) {
  var b = $$Buffer.create(200);
  usage_b(b, speclist, errmsg);
  return $$Buffer.contents(b);
}

function usage(speclist, errmsg) {
  return Curry._1(Printf.eprintf(/* Format */{
                  _0: {
                    TAG: /* String */2,
                    _0: /* No_padding */0,
                    _1: /* End_of_format */0
                  },
                  _1: "%s"
                }), usage_string(speclist, errmsg));
}

var current = {
  contents: 0
};

function bool_of_string_opt(x) {
  try {
    return Pervasives.bool_of_string(x);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Invalid_argument") {
      return ;
    }
    throw exn;
  }
}

function int_of_string_opt(x) {
  try {
    return Caml_format.caml_int_of_string(x);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Failure") {
      return ;
    }
    throw exn;
  }
}

function float_of_string_opt(x) {
  try {
    return Caml_format.caml_float_of_string(x);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Failure") {
      return ;
    }
    throw exn;
  }
}

function parse_and_expand_argv_dynamic_aux(allow_expand, current, argv, speclist, anonfun, errmsg) {
  var initpos = current.contents;
  var convert_error = function (error) {
    var b = $$Buffer.create(200);
    var progname = initpos < argv.contents.length ? Caml_array.get(argv.contents, initpos) : "(?)";
    switch (error.TAG | 0) {
      case /* Unknown */0 :
          var s = error._0;
          switch (s) {
            case "--help" :
            case "-help" :
                break;
            default:
              Curry._2(Printf.bprintf(b, /* Format */{
                        _0: {
                          TAG: /* String */2,
                          _0: /* No_padding */0,
                          _1: {
                            TAG: /* String_literal */11,
                            _0: ": unknown option '",
                            _1: {
                              TAG: /* String */2,
                              _0: /* No_padding */0,
                              _1: {
                                TAG: /* String_literal */11,
                                _0: "'.\n",
                                _1: /* End_of_format */0
                              }
                            }
                          }
                        },
                        _1: "%s: unknown option '%s'.\n"
                      }), progname, s);
          }
          break;
      case /* Wrong */1 :
          Curry._4(Printf.bprintf(b, /* Format */{
                    _0: {
                      TAG: /* String */2,
                      _0: /* No_padding */0,
                      _1: {
                        TAG: /* String_literal */11,
                        _0: ": wrong argument '",
                        _1: {
                          TAG: /* String */2,
                          _0: /* No_padding */0,
                          _1: {
                            TAG: /* String_literal */11,
                            _0: "'; option '",
                            _1: {
                              TAG: /* String */2,
                              _0: /* No_padding */0,
                              _1: {
                                TAG: /* String_literal */11,
                                _0: "' expects ",
                                _1: {
                                  TAG: /* String */2,
                                  _0: /* No_padding */0,
                                  _1: {
                                    TAG: /* String_literal */11,
                                    _0: ".\n",
                                    _1: /* End_of_format */0
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    _1: "%s: wrong argument '%s'; option '%s' expects %s.\n"
                  }), progname, error._1, error._0, error._2);
          break;
      case /* Missing */2 :
          Curry._2(Printf.bprintf(b, /* Format */{
                    _0: {
                      TAG: /* String */2,
                      _0: /* No_padding */0,
                      _1: {
                        TAG: /* String_literal */11,
                        _0: ": option '",
                        _1: {
                          TAG: /* String */2,
                          _0: /* No_padding */0,
                          _1: {
                            TAG: /* String_literal */11,
                            _0: "' needs an argument.\n",
                            _1: /* End_of_format */0
                          }
                        }
                      }
                    },
                    _1: "%s: option '%s' needs an argument.\n"
                  }), progname, error._0);
          break;
      case /* Message */3 :
          Curry._2(Printf.bprintf(b, /* Format */{
                    _0: {
                      TAG: /* String */2,
                      _0: /* No_padding */0,
                      _1: {
                        TAG: /* String_literal */11,
                        _0: ": ",
                        _1: {
                          TAG: /* String */2,
                          _0: /* No_padding */0,
                          _1: {
                            TAG: /* String_literal */11,
                            _0: ".\n",
                            _1: /* End_of_format */0
                          }
                        }
                      }
                    },
                    _1: "%s: %s.\n"
                  }), progname, error._0);
          break;
      
    }
    usage_b(b, speclist.contents, errmsg);
    if (Caml_obj.caml_equal(error, {
            TAG: /* Unknown */0,
            _0: "-help"
          }) || Caml_obj.caml_equal(error, {
            TAG: /* Unknown */0,
            _0: "--help"
          })) {
      return {
              RE_EXN_ID: Help,
              _1: $$Buffer.contents(b)
            };
    } else {
      return {
              RE_EXN_ID: Bad,
              _1: $$Buffer.contents(b)
            };
    }
  };
  current.contents = current.contents + 1 | 0;
  while(current.contents < argv.contents.length) {
    try {
      var s = Caml_array.get(argv.contents, current.contents);
      if (s.length >= 1 && Caml_string.get(s, 0) === /* '-' */45) {
        var match;
        try {
          match = [
            assoc3(s, speclist.contents),
            undefined
          ];
        }
        catch (raw_exn){
          var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
          if (exn.RE_EXN_ID === "Not_found") {
            try {
              var match$1 = split(s);
              match = [
                assoc3(match$1[0], speclist.contents),
                match$1[1]
              ];
            }
            catch (raw_exn$1){
              var exn$1 = Caml_js_exceptions.internalToOCamlException(raw_exn$1);
              if (exn$1.RE_EXN_ID === "Not_found") {
                throw {
                      RE_EXN_ID: Stop,
                      _1: {
                        TAG: /* Unknown */0,
                        _0: s
                      },
                      Error: new Error()
                    };
              }
              throw exn$1;
            }
          } else {
            throw exn;
          }
        }
        var follow = match[1];
        var no_arg = (function(s,follow){
        return function no_arg(param) {
          if (follow === undefined) {
            return ;
          }
          throw {
                RE_EXN_ID: Stop,
                _1: {
                  TAG: /* Wrong */1,
                  _0: s,
                  _1: follow,
                  _2: "no argument"
                },
                Error: new Error()
              };
        }
        }(s,follow));
        var get_arg = (function(s,follow){
        return function get_arg(param) {
          if (follow !== undefined) {
            return follow;
          }
          if ((current.contents + 1 | 0) < argv.contents.length) {
            return Caml_array.get(argv.contents, current.contents + 1 | 0);
          }
          throw {
                RE_EXN_ID: Stop,
                _1: {
                  TAG: /* Missing */2,
                  _0: s
                },
                Error: new Error()
              };
        }
        }(s,follow));
        var consume_arg = (function(follow){
        return function consume_arg(param) {
          if (follow !== undefined) {
            return ;
          } else {
            current.contents = current.contents + 1 | 0;
            return ;
          }
        }
        }(follow));
        var treat_action = (function(s){
        return function treat_action(f) {
          switch (f.TAG | 0) {
            case /* Unit */0 :
                return Curry._1(f._0, undefined);
            case /* Bool */1 :
                var arg = get_arg(undefined);
                var s$1 = bool_of_string_opt(arg);
                if (s$1 !== undefined) {
                  Curry._1(f._0, s$1);
                } else {
                  throw {
                        RE_EXN_ID: Stop,
                        _1: {
                          TAG: /* Wrong */1,
                          _0: s,
                          _1: arg,
                          _2: "a boolean"
                        },
                        Error: new Error()
                      };
                }
                return consume_arg(undefined);
            case /* Set */2 :
                no_arg(undefined);
                f._0.contents = true;
                return ;
            case /* Clear */3 :
                no_arg(undefined);
                f._0.contents = false;
                return ;
            case /* String */4 :
                var arg$1 = get_arg(undefined);
                Curry._1(f._0, arg$1);
                return consume_arg(undefined);
            case /* Set_string */5 :
                f._0.contents = get_arg(undefined);
                return consume_arg(undefined);
            case /* Int */6 :
                var arg$2 = get_arg(undefined);
                var x = int_of_string_opt(arg$2);
                if (x !== undefined) {
                  Curry._1(f._0, x);
                } else {
                  throw {
                        RE_EXN_ID: Stop,
                        _1: {
                          TAG: /* Wrong */1,
                          _0: s,
                          _1: arg$2,
                          _2: "an integer"
                        },
                        Error: new Error()
                      };
                }
                return consume_arg(undefined);
            case /* Set_int */7 :
                var arg$3 = get_arg(undefined);
                var x$1 = int_of_string_opt(arg$3);
                if (x$1 !== undefined) {
                  f._0.contents = x$1;
                } else {
                  throw {
                        RE_EXN_ID: Stop,
                        _1: {
                          TAG: /* Wrong */1,
                          _0: s,
                          _1: arg$3,
                          _2: "an integer"
                        },
                        Error: new Error()
                      };
                }
                return consume_arg(undefined);
            case /* Float */8 :
                var arg$4 = get_arg(undefined);
                var x$2 = float_of_string_opt(arg$4);
                if (x$2 !== undefined) {
                  Curry._1(f._0, x$2);
                } else {
                  throw {
                        RE_EXN_ID: Stop,
                        _1: {
                          TAG: /* Wrong */1,
                          _0: s,
                          _1: arg$4,
                          _2: "a float"
                        },
                        Error: new Error()
                      };
                }
                return consume_arg(undefined);
            case /* Set_float */9 :
                var arg$5 = get_arg(undefined);
                var x$3 = float_of_string_opt(arg$5);
                if (x$3 !== undefined) {
                  f._0.contents = x$3;
                } else {
                  throw {
                        RE_EXN_ID: Stop,
                        _1: {
                          TAG: /* Wrong */1,
                          _0: s,
                          _1: arg$5,
                          _2: "a float"
                        },
                        Error: new Error()
                      };
                }
                return consume_arg(undefined);
            case /* Tuple */10 :
                return List.iter(treat_action, f._0);
            case /* Symbol */11 :
                var symb = f._0;
                var arg$6 = get_arg(undefined);
                if (List.mem(arg$6, symb)) {
                  Curry._1(f._1, arg$6);
                  return consume_arg(undefined);
                }
                throw {
                      RE_EXN_ID: Stop,
                      _1: {
                        TAG: /* Wrong */1,
                        _0: s,
                        _1: arg$6,
                        _2: "one of: " + make_symlist("", " ", "", symb)
                      },
                      Error: new Error()
                    };
            case /* Rest */12 :
                var f$1 = f._0;
                while(current.contents < (argv.contents.length - 1 | 0)) {
                  Curry._1(f$1, Caml_array.get(argv.contents, current.contents + 1 | 0));
                  consume_arg(undefined);
                };
                return ;
            case /* Expand */13 :
                if (!allow_expand) {
                  throw {
                        RE_EXN_ID: "Invalid_argument",
                        _1: "Arg.Expand is is only allowed with Arg.parse_and_expand_argv_dynamic",
                        Error: new Error()
                      };
                }
                var arg$7 = get_arg(undefined);
                var newarg = Curry._1(f._0, arg$7);
                consume_arg(undefined);
                var before = $$Array.sub(argv.contents, 0, current.contents + 1 | 0);
                var after = $$Array.sub(argv.contents, current.contents + 1 | 0, (argv.contents.length - current.contents | 0) - 1 | 0);
                argv.contents = Caml_array.caml_array_concat({
                      hd: before,
                      tl: {
                        hd: newarg,
                        tl: {
                          hd: after,
                          tl: /* [] */0
                        }
                      }
                    });
                return ;
            
          }
        }
        }(s));
        treat_action(match[0]);
      } else {
        Curry._1(anonfun, s);
      }
    }
    catch (raw_m){
      var m = Caml_js_exceptions.internalToOCamlException(raw_m);
      if (m.RE_EXN_ID === Bad) {
        throw convert_error({
                  TAG: /* Message */3,
                  _0: m._1
                });
      }
      if (m.RE_EXN_ID === Stop) {
        throw convert_error(m._1);
      }
      throw m;
    }
    current.contents = current.contents + 1 | 0;
  };
  
}

function parse_and_expand_argv_dynamic(current, argv, speclist, anonfun, errmsg) {
  return parse_and_expand_argv_dynamic_aux(true, current, argv, speclist, anonfun, errmsg);
}

function parse_argv_dynamic(currentOpt, argv, speclist, anonfun, errmsg) {
  var current$1 = currentOpt !== undefined ? currentOpt : current;
  return parse_and_expand_argv_dynamic_aux(false, current$1, {
              contents: argv
            }, speclist, anonfun, errmsg);
}

function parse_argv(currentOpt, argv, speclist, anonfun, errmsg) {
  var current$1 = currentOpt !== undefined ? currentOpt : current;
  return parse_argv_dynamic(current$1, argv, {
              contents: speclist
            }, anonfun, errmsg);
}

function parse(l, f, msg) {
  try {
    return parse_argv(undefined, Sys.argv, l, f, msg);
  }
  catch (raw_msg){
    var msg$1 = Caml_js_exceptions.internalToOCamlException(raw_msg);
    if (msg$1.RE_EXN_ID === Bad) {
      Curry._1(Printf.eprintf(/* Format */{
                _0: {
                  TAG: /* String */2,
                  _0: /* No_padding */0,
                  _1: /* End_of_format */0
                },
                _1: "%s"
              }), msg$1._1);
      return Pervasives.exit(2);
    }
    if (msg$1.RE_EXN_ID === Help) {
      Curry._1(Printf.printf(/* Format */{
                _0: {
                  TAG: /* String */2,
                  _0: /* No_padding */0,
                  _1: /* End_of_format */0
                },
                _1: "%s"
              }), msg$1._1);
      return Pervasives.exit(0);
    }
    throw msg$1;
  }
}

function parse_dynamic(l, f, msg) {
  try {
    return parse_argv_dynamic(undefined, Sys.argv, l, f, msg);
  }
  catch (raw_msg){
    var msg$1 = Caml_js_exceptions.internalToOCamlException(raw_msg);
    if (msg$1.RE_EXN_ID === Bad) {
      Curry._1(Printf.eprintf(/* Format */{
                _0: {
                  TAG: /* String */2,
                  _0: /* No_padding */0,
                  _1: /* End_of_format */0
                },
                _1: "%s"
              }), msg$1._1);
      return Pervasives.exit(2);
    }
    if (msg$1.RE_EXN_ID === Help) {
      Curry._1(Printf.printf(/* Format */{
                _0: {
                  TAG: /* String */2,
                  _0: /* No_padding */0,
                  _1: /* End_of_format */0
                },
                _1: "%s"
              }), msg$1._1);
      return Pervasives.exit(0);
    }
    throw msg$1;
  }
}

function parse_expand(l, f, msg) {
  try {
    var argv = {
      contents: Sys.argv
    };
    var spec = {
      contents: l
    };
    var current$1 = {
      contents: current.contents
    };
    return parse_and_expand_argv_dynamic(current$1, argv, spec, f, msg);
  }
  catch (raw_msg){
    var msg$1 = Caml_js_exceptions.internalToOCamlException(raw_msg);
    if (msg$1.RE_EXN_ID === Bad) {
      Curry._1(Printf.eprintf(/* Format */{
                _0: {
                  TAG: /* String */2,
                  _0: /* No_padding */0,
                  _1: /* End_of_format */0
                },
                _1: "%s"
              }), msg$1._1);
      return Pervasives.exit(2);
    }
    if (msg$1.RE_EXN_ID === Help) {
      Curry._1(Printf.printf(/* Format */{
                _0: {
                  TAG: /* String */2,
                  _0: /* No_padding */0,
                  _1: /* End_of_format */0
                },
                _1: "%s"
              }), msg$1._1);
      return Pervasives.exit(0);
    }
    throw msg$1;
  }
}

function second_word(s) {
  var len = s.length;
  var loop = function (_n) {
    while(true) {
      var n = _n;
      if (n >= len) {
        return len;
      }
      if (Caml_string.get(s, n) !== /* ' ' */32) {
        return n;
      }
      _n = n + 1 | 0;
      continue ;
    };
  };
  var n;
  try {
    n = $$String.index(s, /* '\t' */9);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Not_found") {
      var exit = 0;
      var n$1;
      try {
        n$1 = $$String.index(s, /* ' ' */32);
        exit = 2;
      }
      catch (raw_exn$1){
        var exn$1 = Caml_js_exceptions.internalToOCamlException(raw_exn$1);
        if (exn$1.RE_EXN_ID === "Not_found") {
          return len;
        }
        throw exn$1;
      }
      if (exit === 2) {
        return loop(n$1 + 1 | 0);
      }
      
    } else {
      throw exn;
    }
  }
  return loop(n + 1 | 0);
}

function max_arg_len(cur, param) {
  var kwd = param[0];
  if (param[1].TAG === /* Symbol */11) {
    return Caml_primitive.caml_int_max(cur, kwd.length);
  } else {
    return Caml_primitive.caml_int_max(cur, kwd.length + second_word(param[2]) | 0);
  }
}

function replace_leading_tab(s) {
  var seen = {
    contents: false
  };
  return $$String.map((function (c) {
                if (c !== 9 || seen.contents) {
                  return c;
                } else {
                  seen.contents = true;
                  return /* ' ' */32;
                }
              }), s);
}

function align(limitOpt, speclist) {
  var limit = limitOpt !== undefined ? limitOpt : Pervasives.max_int;
  var completed = add_help(speclist);
  var len = List.fold_left(max_arg_len, 0, completed);
  var len$1 = len < limit ? len : limit;
  return List.map((function (param) {
                var spec = param[1];
                var kwd = param[0];
                if (param[2] === "") {
                  return param;
                }
                if (spec.TAG === /* Symbol */11) {
                  var msg = param[2];
                  var cutcol = second_word(msg);
                  var spaces = " ".repeat(Caml_primitive.caml_int_max(0, len$1 - cutcol | 0) + 3 | 0);
                  return [
                          kwd,
                          spec,
                          "\n" + (spaces + replace_leading_tab(msg))
                        ];
                }
                var msg$1 = param[2];
                var cutcol$1 = second_word(msg$1);
                var kwd_len = kwd.length;
                var diff = (len$1 - kwd_len | 0) - cutcol$1 | 0;
                if (diff <= 0) {
                  return [
                          kwd,
                          spec,
                          replace_leading_tab(msg$1)
                        ];
                }
                var spaces$1 = " ".repeat(diff);
                var prefix = $$String.sub(replace_leading_tab(msg$1), 0, cutcol$1);
                var suffix = $$String.sub(msg$1, cutcol$1, msg$1.length - cutcol$1 | 0);
                return [
                        kwd,
                        spec,
                        prefix + (spaces$1 + suffix)
                      ];
              }), completed);
}

function trim_cr(s) {
  var len = s.length;
  if (len > 0 && Caml_string.get(s, len - 1 | 0) === /* '\r' */13) {
    return $$String.sub(s, 0, len - 1 | 0);
  } else {
    return s;
  }
}

function read_aux(trim, sep, file) {
  var ic = Pervasives.open_in_bin(file);
  var buf = $$Buffer.create(200);
  var words = {
    contents: /* [] */0
  };
  var stash = function (param) {
    var word = $$Buffer.contents(buf);
    var word$1 = trim ? trim_cr(word) : word;
    words.contents = {
      hd: word$1,
      tl: words.contents
    };
    buf.position = 0;
    
  };
  var read = function (param) {
    try {
      var c = Caml_external_polyfill.resolve("caml_ml_input_char")(ic);
      if (c === sep) {
        stash(undefined);
        return read(undefined);
      } else {
        $$Buffer.add_char(buf, c);
        return read(undefined);
      }
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.RE_EXN_ID === "End_of_file") {
        if (buf.position > 0) {
          return stash(undefined);
        } else {
          return ;
        }
      }
      throw exn;
    }
  };
  read(undefined);
  Caml_external_polyfill.resolve("caml_ml_close_channel")(ic);
  return $$Array.of_list(List.rev(words.contents));
}

function read_arg(param) {
  return read_aux(true, /* '\n' */10, param);
}

function read_arg0(param) {
  return read_aux(false, /* '\000' */0, param);
}

function write_aux(sep, file, args) {
  var oc = Pervasives.open_out_bin(file);
  $$Array.iter((function (s) {
          return Curry._2(Printf.fprintf(oc, /* Format */{
                          _0: {
                            TAG: /* String */2,
                            _0: /* No_padding */0,
                            _1: {
                              TAG: /* Char */0,
                              _0: /* End_of_format */0
                            }
                          },
                          _1: "%s%c"
                        }), s, sep);
        }), args);
  Caml_io.caml_ml_flush(oc);
  return Caml_external_polyfill.resolve("caml_ml_close_channel")(oc);
}

function write_arg(param, param$1) {
  return write_aux(/* '\n' */10, param, param$1);
}

function write_arg0(param, param$1) {
  return write_aux(/* '\000' */0, param, param$1);
}

export {
  parse ,
  parse_dynamic ,
  parse_argv ,
  parse_argv_dynamic ,
  parse_and_expand_argv_dynamic ,
  parse_expand ,
  Help ,
  Bad ,
  usage ,
  usage_string ,
  align ,
  current ,
  read_arg ,
  read_arg0 ,
  write_arg ,
  write_arg0 ,
  
}
/* No side effect */
