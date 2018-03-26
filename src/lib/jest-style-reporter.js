import chalk from "chalk";

function indent(str, amount) {
  return str
    .split("\n")
    .map(line => " ".repeat(amount) + line)
    .join("\n");
}

function Reporter() {
  let logMessages;
  let specResults;
  this.onRunStart = function() {
    logMessages = [];
    specResults = [];
  };

  this.onBrowserLog = function(browser, message, type) {
    let color =
      {
        log: "white",
        info: "blue",
        error: "red",
        warn: "yellow"
      }[type] || "grey";

    logMessages.push(
      chalk.grey(`console.${type}\n`) + indent(chalk[color](message), 2)
    );
  };

  this.onSpecComplete = function(browser, result) {
    specResults.push(result);
    return;
  };

  function printSuites(suiteArray) {
    let indentLevel = -1;
    suiteArray.forEach(suite => {
      indentLevel += 1;
      console.log(indent(suite, indentLevel * 2));
    });
    return indentLevel;
  }

  function printResult(result, indentLevel) {
    let message = "";
    if (result.success) {
      message += chalk.green("✓ ");
    } else {
      message += chalk.red("✕ ");
    }
    message += chalk.grey(result.description);

    console.log(indent(message, indentLevel * 2));
  }

  function formatError(message) {
    return message
      .split("\n")
      .map(line => {
        let output = line;

        // Errors from expect show the matcher hint in gray. Detect that and
        // print those errors nicely.
        if (line.indexOf("Error: \u001b[2m") === 0) {
          output = line.replace(/^Error: /, "") + "\n";
        }

        // Remove karma URLs from stack traces.
        output = output.replace(
          /(at .* \()http:\/\/localhost:\d+\/base\//,
          "$1"
        );

        return output;
      })
      .join("\n");
  }

  function summarizeFailingResult(result) {
    console.log(
      chalk.hex("#ff5151")(
        "● " + result.suite.concat(result.description).join(" › ")
      ) + "\n"
    );

    if (result.log.length > 0) {
      const errorMessage = formatError(result.log.join("\n"));
      console.log(indent(errorMessage, 2) + "\n");
    }
  }

  this.onRunComplete = function(browsers, results) {
    const specDedupingDelimiter = "|||KARMA_NIGHTMARE|||";
    const dedupedSpecResults = {};
    specResults.forEach(result => {
      const key = result.suite.join(specDedupingDelimiter);
      if (dedupedSpecResults[key] == null) {
        dedupedSpecResults[key] = [result];
      } else {
        dedupedSpecResults[key].push(result);
      }
    });
    Object.entries(dedupedSpecResults).forEach(([key, suiteResults]) => {
      const suite = key.split(specDedupingDelimiter);
      const indentLevel = printSuites(suite);
      suiteResults.forEach(result => {
        printResult(result, indentLevel + 1);
      });
    });

    const failing = specResults.filter(result => !result.success);
    if (failing.length > 0) {
      process.stdout.write("\n");
      failing.forEach(summarizeFailingResult);
    }

    if (logMessages.length > 0) {
      process.stdout.write("\n");
    }
    logMessages.forEach(message => console.log(message));

    let summaryNotes = [];
    if (results.failed) {
      summaryNotes.push(chalk.red(`${results.failed} failed`));
    }
    if (results.success) {
      summaryNotes.push(chalk.green(`${results.success} passed`));
    }
    summaryNotes.push(`${results.success + results.failed} total`);

    if (results.failed === 0) {
      process.stdout.write("\n");
    }
    console.log(summaryNotes.join(", "));
  };
}
Reporter.$inject = [];

module.exports = {
  "reporter:jest-style": ["type", Reporter]
};
