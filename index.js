import JishoAPI from "unofficial-jisho-api";
import fs from "fs";

const jisho = new JishoAPI();

// read input
// split input into Array

const text = fs.readFileSync("input.txt", "utf8");
const inputData = text.split(/\r?\n/);
const outputData = [];

//fs.writeFileSync("output.txt", "");

// run each item in Array through Jisho wrapper API => return a result Array
// e.g. [{word: "", example: "", exReading: ""}]

inputData.forEach((data) => {
    outputData.push(
        jisho
            .searchForExamples(data)
            .then((result) => {
                let example = result.results[0] || {
                    kanji: "No data for Kanji",
                    kana: "No data for Kana",
                    english: "No data for English",
                };
                let resultData = {
                    word: data,
                    jisho:
                        example.kanji +
                        "\n" +
                        example.kana +
                        "\n" +
                        example.english,
                };
                return resultData;
            })
            .catch((err) => console.log("Error for: " + data, err))
    );
});

// output the result Array in CSV format.

Promise.all(outputData).then((results) => {
    results.forEach((result) => {
        let output = result.word + "," + `"${result.jisho}"` + "\n";
        fs.appendFileSync("output.txt", output);
    });
});
