export default function loadMode(mode) {
  switch (mode) {
    case 'apl':
      return import(
        'codemirror/mode/apl/apl.js'
      );
    case 'asciiarmor':
      return import(
        'codemirror/mode/asciiarmor/asciiarmor.js'
      );
    case 'asn.1':
      return import(
        'codemirror/mode/asn.1/asn.1.js'
      );
    case 'asterisk':
      return import(
        'codemirror/mode/asterisk/asterisk.js'
      );
    case 'brainfuck':
      return import(
        'codemirror/mode/brainfuck/brainfuck.js'
      );
    case 'clike':
      return import(
        'codemirror/mode/clike/clike.js'
      );
    case 'clojure':
      return import(
        'codemirror/mode/clojure/clojure.js'
      );
    case 'cmake':
      return import(
        'codemirror/mode/cmake/cmake.js'
      );
    case 'cobol':
      return import(
        'codemirror/mode/cobol/cobol.js'
      );
    case 'coffeescript':
      return import(
        'codemirror/mode/coffeescript/coffeescript.js'
      );
    case 'commonlisp':
      return import(
        'codemirror/mode/commonlisp/commonlisp.js'
      );
    case 'crystal':
      return import(
        'codemirror/mode/crystal/crystal.js'
      );
    case 'css':
      return import(
        'codemirror/mode/css/css.js'
      );
    case 'cypher':
      return import(
        'codemirror/mode/cypher/cypher.js'
      );
    case 'd':
      return import(
        'codemirror/mode/d/d.js'
      );
    case 'dart':
      return import(
        'codemirror/mode/dart/dart.js'
      );
    case 'diff':
      return import(
        'codemirror/mode/diff/diff.js'
      );
    case 'django':
      return import(
        'codemirror/mode/django/django.js'
      );
    case 'dockerfile':
      return import(
        'codemirror/mode/dockerfile/dockerfile.js'
      );
    case 'dtd':
      return import(
        'codemirror/mode/dtd/dtd.js'
      );
    case 'dylan':
      return import(
        'codemirror/mode/dylan/dylan.js'
      );
    case 'ebnf':
      return import(
        'codemirror/mode/ebnf/ebnf.js'
      );
    case 'ecl':
      return import(
        'codemirror/mode/ecl/ecl.js'
      );
    case 'eiffel':
      return import(
        'codemirror/mode/eiffel/eiffel.js'
      );
    case 'elm':
      return import(
        'codemirror/mode/elm/elm.js'
      );
    case 'erlang':
      return import(
        'codemirror/mode/erlang/erlang.js'
      );
    case 'factor':
      return import(
        'codemirror/mode/factor/factor.js'
      );
    case 'fcl':
      return import(
        'codemirror/mode/fcl/fcl.js'
      );
    case 'forth':
      return import(
        'codemirror/mode/forth/forth.js'
      );
    case 'fortran':
      return import(
        'codemirror/mode/fortran/fortran.js'
      );
    case 'gas':
      return import(
        'codemirror/mode/gas/gas.js'
      );
    case 'gfm':
      return import(
        'codemirror/mode/gfm/gfm.js'
      );
    case 'gherkin':
      return import(
        'codemirror/mode/gherkin/gherkin.js'
      );
    case 'go':
      return import(
        'codemirror/mode/go/go.js'
      );
    case 'groovy':
      return import(
        'codemirror/mode/groovy/groovy.js'
      );
    case 'haml':
      return import(
        'codemirror/mode/haml/haml.js'
      );
    case 'handlebars':
      return import(
        'codemirror/mode/handlebars/handlebars.js'
      );
    case 'haskell':
      return import(
        'codemirror/mode/haskell/haskell.js'
      );
    case 'haskell-literate':
      return import(
        'codemirror/mode/haskell-literate/haskell-literate.js'
      );
    case 'haxe':
      return import(
        'codemirror/mode/haxe/haxe.js'
      );
    case 'htmlembedded':
      return import(
        'codemirror/mode/htmlembedded/htmlembedded.js'
      );
    case 'htmlmixed':
      return import(
        'codemirror/mode/htmlmixed/htmlmixed.js'
      );
    case 'http':
      return import(
        'codemirror/mode/http/http.js'
      );
    case 'idl':
      return import(
        'codemirror/mode/idl/idl.js'
      );
    case 'javascript':
      return import(
        'codemirror/mode/javascript/javascript.js'
      );
    case 'jinja2':
      return import(
        'codemirror/mode/jinja2/jinja2.js'
      );
    case 'jsx':
      return import(
        'codemirror/mode/jsx/jsx.js'
      );
    case 'julia':
      return import(
        'codemirror/mode/julia/julia.js'
      );
    case 'livescript':
      return import(
        'codemirror/mode/livescript/livescript.js'
      );
    case 'lua':
      return import(
        'codemirror/mode/lua/lua.js'
      );
    case 'markdown':
      return import(
        'codemirror/mode/markdown/markdown.js'
      );
    case 'mathematica':
      return import(
        'codemirror/mode/mathematica/mathematica.js'
      );
    case 'mbox':
      return import(
        'codemirror/mode/mbox/mbox.js'
      );
    case 'mirc':
      return import(
        'codemirror/mode/mirc/mirc.js'
      );
    case 'mllike':
      return import(
        'codemirror/mode/mllike/mllike.js'
      );
    case 'modelica':
      return import(
        'codemirror/mode/modelica/modelica.js'
      );
    case 'mscgen':
      return import(
        'codemirror/mode/mscgen/mscgen.js'
      );
    case 'mumps':
      return import(
        'codemirror/mode/mumps/mumps.js'
      );
    case 'nginx':
      return import(
        'codemirror/mode/nginx/nginx.js'
      );
    case 'nsis':
      return import(
        'codemirror/mode/nsis/nsis.js'
      );
    case 'ntriples':
      return import(
        'codemirror/mode/ntriples/ntriples.js'
      );
    case 'octave':
      return import(
        'codemirror/mode/octave/octave.js'
      );
    case 'oz':
      return import(
        'codemirror/mode/oz/oz.js'
      );
    case 'pascal':
      return import(
        'codemirror/mode/pascal/pascal.js'
      );
    case 'pegjs':
      return import(
        'codemirror/mode/pegjs/pegjs.js'
      );
    case 'perl':
      return import(
        'codemirror/mode/perl/perl.js'
      );
    case 'php':
      return import(
        'codemirror/mode/php/php.js'
      );
    case 'pig':
      return import(
        'codemirror/mode/pig/pig.js'
      );
    case 'powershell':
      return import(
        'codemirror/mode/powershell/powershell.js'
      );
    case 'properties':
      return import(
        'codemirror/mode/properties/properties.js'
      );
    case 'protobuf':
      return import(
        'codemirror/mode/protobuf/protobuf.js'
      );
    case 'pug':
      return import(
        'codemirror/mode/pug/pug.js'
      );
    case 'puppet':
      return import(
        'codemirror/mode/puppet/puppet.js'
      );
    case 'python':
      return import(
        'codemirror/mode/python/python.js'
      );
    case 'q':
      return import(
        'codemirror/mode/q/q.js'
      );
    case 'r':
      return import(
        'codemirror/mode/r/r.js'
      );
    case 'rpm':
      return import(
        'codemirror/mode/rpm/rpm.js'
      );
    case 'rst':
      return import(
        'codemirror/mode/rst/rst.js'
      );
    case 'ruby':
      return import(
        'codemirror/mode/ruby/ruby.js'
      );
    case 'rust':
      return import(
        'codemirror/mode/rust/rust.js'
      );
    case 'sas':
      return import(
        'codemirror/mode/sas/sas.js'
      );
    case 'sass':
      return import(
        'codemirror/mode/sass/sass.js'
      );
    case 'scheme':
      return import(
        'codemirror/mode/scheme/scheme.js'
      );
    case 'shell':
      return import(
        'codemirror/mode/shell/shell.js'
      );
    case 'sieve':
      return import(
        'codemirror/mode/sieve/sieve.js'
      );
    case 'slim':
      return import(
        'codemirror/mode/slim/slim.js'
      );
    case 'smalltalk':
      return import(
        'codemirror/mode/smalltalk/smalltalk.js'
      );
    case 'smarty':
      return import(
        'codemirror/mode/smarty/smarty.js'
      );
    case 'solr':
      return import(
        'codemirror/mode/solr/solr.js'
      );
    case 'soy':
      return import(
        'codemirror/mode/soy/soy.js'
      );
    case 'sparql':
      return import(
        'codemirror/mode/sparql/sparql.js'
      );
    case 'spreadsheet':
      return import(
        'codemirror/mode/spreadsheet/spreadsheet.js'
      );
    case 'sql':
      return import(
        'codemirror/mode/sql/sql.js'
      );
    case 'stex':
      return import(
        'codemirror/mode/stex/stex.js'
      );
    case 'stylus':
      return import(
        'codemirror/mode/stylus/stylus.js'
      );
    case 'swift':
      return import(
        'codemirror/mode/swift/swift.js'
      );
    case 'tcl':
      return import(
        'codemirror/mode/tcl/tcl.js'
      );
    case 'textile':
      return import(
        'codemirror/mode/textile/textile.js'
      );
    case 'tiddlywiki':
      return import(
        'codemirror/mode/tiddlywiki/tiddlywiki.js'
      );
    case 'tiki':
      return import(
        'codemirror/mode/tiki/tiki.js'
      );
    case 'toml':
      return import(
        'codemirror/mode/toml/toml.js'
      );
    case 'tornado':
      return import(
        'codemirror/mode/tornado/tornado.js'
      );
    case 'troff':
      return import(
        'codemirror/mode/troff/troff.js'
      );
    case 'ttcn':
      return import(
        'codemirror/mode/ttcn/ttcn.js'
      );
    case 'ttcn-cfg':
      return import(
        'codemirror/mode/ttcn-cfg/ttcn-cfg.js'
      );
    case 'turtle':
      return import(
        'codemirror/mode/turtle/turtle.js'
      );
    case 'twig':
      return import(
        'codemirror/mode/twig/twig.js'
      );
    case 'vb':
      return import(
        'codemirror/mode/vb/vb.js'
      );
    case 'vbscript':
      return import(
        'codemirror/mode/vbscript/vbscript.js'
      );
    case 'velocity':
      return import(
        'codemirror/mode/velocity/velocity.js'
      );
    case 'verilog':
      return import(
        'codemirror/mode/verilog/verilog.js'
      );
    case 'vhdl':
      return import(
        'codemirror/mode/vhdl/vhdl.js'
      );
    case 'vue':
      return import(
        'codemirror/mode/vue/vue.js'
      );
    case 'webidl':
      return import(
        'codemirror/mode/webidl/webidl.js'
      );
    case 'xml':
      return import(
        'codemirror/mode/xml/xml.js'
      );
    case 'xquery':
      return import(
        'codemirror/mode/xquery/xquery.js'
      );
    case 'yacas':
      return import(
        'codemirror/mode/yacas/yacas.js'
      );
    case 'yaml':
      return import(
        'codemirror/mode/yaml/yaml.js'
      );
    case 'yaml-frontmatter':
      return import(
        'codemirror/mode/yaml-frontmatter/yaml-frontmatter.js'
      );
    case 'z80':
      return import(
        'codemirror/mode/z80/z80.js'
      );
    default:
      return Promise.resolve();
  }
}
