import chalk from "chalk";
import set from "lodash.set";

const lightRed = "#f14c4c";
const lightGreen = "#23d18b";
const lightYellow = "#f5f543";

function indent(str, amount) {
  const indentAmount = amount * 2; // 2 spaces
  return str
    .split("\n")
    .map(line => " ".repeat(indentAmount) + line)
    .join("\n");
}

const resultKey = Symbol("result");

function printResultTree(resultTree, indentLevel = 0) {
  Object.entries(resultTree).forEach(([key, value]) => {
    if (value[resultKey]) {
      printResult(value, indentLevel);
    } else {
      console.log(indent(key, indentLevel));
      printResultTree(value, indentLevel + 1);
    }
  });
}

function printResult(result, indentLevel) {
  let message = "";
  if (result.pending || result.skipped) {
    message += chalk.yellow("○ ");
  } else if (result.success) {
    message += chalk.green("✓ ");
  } else {
    message += chalk.red("✕ ");
  }
  message += chalk.grey(result.description);

  console.log(indent(message, indentLevel));
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
      output = output.replace(/(at .* \()http:\/\/localhost:\d+\/base\//, "$1");

      return output;
    })
    .join("\n")
    .trim();
}

function summarizeFailingResult(result) {
  console.log(
    chalk.hex(lightRed)(
      chalk.bold("● " + result.suite.concat(result.description).join(" › "))
    ) + "\n"
  );

  if (result.log.length > 0) {
    const errorMessage = formatError(result.log.join("\n"));
    console.log(indent(errorMessage, 2) + "\n");
  }
}

function specCountSummary(specResults) {
  const numFailed = specResults.filter(result => result.success === false)
    .length;
  const numSuccess = specResults.filter(
    result => result.success && !(result.pending || result.skipped)
  ).length;
  const numSkipped = specResults.filter(
    result => result.pending || result.skipped
  ).length;

  let summaryNotes = [];
  if (numFailed > 0) {
    summaryNotes.push(chalk.bold(chalk.hex(lightRed)(`${numFailed} failed`)));
  }
  if (numSkipped > 0) {
    summaryNotes.push(
      chalk.bold(chalk.hex(lightYellow)(`${numSkipped} skipped`))
    );
  }
  if (numSuccess > 0) {
    summaryNotes.push(
      chalk.bold(chalk.hex(lightGreen)(`${numSuccess} passed`))
    );
  }
  summaryNotes.push(`${numFailed + numSkipped + numSuccess} total`);

  return summaryNotes.join(", ");
}

function clearScreen() {
  console.log("\u001b[2J\u001b[0;0H"); // Clear screen
  console.log("\u001b[3J"); // Clear scrollback
}

function Reporter(config) {
  let logMessages;
  let specResults;
  let startTime;
  this.onRunStart = function() {
    if (!config.singleRun) {
      clearScreen();
    }
    logMessages = [];
    specResults = [];
    startTime = Date.now();
  };

  this.onBrowserLog = function(browser, message, type) {
    let color = {
      error: "red",
      warn: "yellow"
    }[type];

    let label = `console.${type}\n`;

    if (color) {
      label = chalk[color](label);
      message = chalk[color](message);
    }

    logMessages.push(chalk.dim(label) + indent(message, 1));
  };

  this.onSpecComplete = function(browser, result) {
    specResults.push(result);
    return;
  };

  this.onRunComplete = function(browsers, results) {
    const resultTree = {};
    specResults.forEach(result => {
      result[resultKey] = true;
      set(resultTree, [...result.suite, result.description], result);
    });
    printResultTree(resultTree);
    if (results.length > 0) {
      process.stdout.write("\n");
    }

    const failing = specResults.filter(result => !result.success);
    if (failing.length > 0) {
      failing.forEach(summarizeFailingResult);
      process.stdout.write("\n");
    }

    logMessages.forEach(message => console.log(message + "\n"));

    if (results.error) {
      console.log(
        chalk.red(
          "An error occurred during test definition. Run your tests with "
        ) +
          chalk.grey("--dev-tools") +
          chalk.red(" to debug the error.")
      );
      return;
    }

    console.log(chalk.bold("Tests: " + specCountSummary(specResults)));
    console.log(chalk.bold("Time:  " + (Date.now() - startTime) + "ms"));
  };
}
Reporter.$inject = ["config"];

module.exports = {
  "reporter:jest-style": ["type", Reporter]
};
