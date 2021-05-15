console.log(JSON.stringify((function (runOnFile, filePathOrText) {
  function not(boolean) { return Boolean(boolean) === false; }
  try {
    var NO_MODULE_ERROR = { error: true, type: 'NO_MODULE', name: 'eslint' };
    const NO_FILE_ERROR = { error: true, type: 'NO_FILE' };
    var UNKNOWN_ERROR = { error: true, type: 'UNKNOWN' };

    const eslint = require('eslint');
    const engine = new eslint.CLIEngine({
      useEslintrc: true, cacheFile: '.eslintcache', ignore: true, allowInlineConfig: true,
    });
    const report = runOnFile ? engine.executeOnFiles([`./${filePathOrText}`]) : engine.executeOnText(filePathOrText);
    const singleFileResult = report.results[0];
    if (not(singleFileResult)) return NO_FILE_ERROR;
    delete singleFileResult.source;
    singleFileResult.messages.forEach((message) => {
      delete message.source;
      delete message.fix;
      delete message.nodeType;
    });
    return singleFileResult;
  } catch (err) {
    const errorMessage = String(err);
    const noModuleKeyword = 'Cannot find module ';
    if (errorMessage.indexOf(noModuleKeyword) > -1) {
      NO_MODULE_ERROR.message = errorMessage;
      return NO_MODULE_ERROR;
    }
    UNKNOWN_ERROR.message = errorMessage;
    return UNKNOWN_ERROR;
  }
})(BOOL, PARAMS)));
