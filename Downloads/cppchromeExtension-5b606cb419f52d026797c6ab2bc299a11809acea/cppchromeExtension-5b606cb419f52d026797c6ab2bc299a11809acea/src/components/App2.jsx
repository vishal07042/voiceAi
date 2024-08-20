import React, { useEffect, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { cpp } from "@codemirror/lang-cpp";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { autocompletion, completeFromList } from "@codemirror/autocomplete";

import { vim } from "@replit/codemirror-vim";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import cpps from "highlight.js/lib/languages/cpp";
// import { autocompletion } from "@codemirror/autocomplete";


// Define some example suggestions for autocomplete
const cppSuggestions = [
  { label: 'int', type: 'keyword' },
  { label: 'float', type: 'keyword' },
  { label: 'std::cout', type: 'function' },
  { label: 'iostream', type: 'keyword' },
  { label: 'main', type: 'snippet', insertText: 'int main(){return 0;}' },
  // Add more suggestions as needed
];


const autocompleteExtension = autocompletion({
	override: [completeFromList(cppSuggestions)],
});



const stripHtmlTags = (html) => {
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = html;
	// Replace <br> tags with new lines
	let textWithNewLines = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, "\n");
	// Remove ```cpp``` strings
	textWithNewLines = textWithNewLines.replace(/```cpp/g, "");
	tempDiv.innerHTML = textWithNewLines;
	return tempDiv.textContent || tempDiv.innerText || "";
};

function App2() {
	// const ccpp = hljs.registerLanguage("cpp", cpp);

	const musicalNote = ["♪", "♫", "♬", "♩"];
	const [fullCode, setFullCode] = useState(``);

	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [choices, setChoices] = useState([]);
	const [answer, setAnswer] = useState("");

	const [randomNumber, setRandomNumber] = useState(2);

	const [variabletoAnswer, setVariabletoAnswer] = useState(false);

	const [editCode, setEditCode] = useState(true);

	useEffect(() => {
		chrome.runtime.sendMessage(
			{ message: "getRandomQuestion" },
			(response) => {
				console.log("Initial response received:", response);

				console.log("code is ", response[0].code2);
				if (response && response.length > 0) {
					console.log(response[0].answer);
					setAnswer(response[0].answer);
					setTitle(response[0].title);
					setChoices(response[0].choices);
					const plainCode = stripHtmlTags(response[0].code2);
					console.log("response code is ", response[0].code2);
					console.log("plain code is", plainCode);
					setCode(plainCode);
				}
			}
		);
	}, []);

	const fetchNextQuestion = () => {
		console.log("Next question button clicked");
		chrome.runtime.sendMessage(
			{ message: "getRandomQuestion" },
			(response) => {
				if (response && response.length > 0) {
					console.log(response[0].answer);
					setAnswer(response[0].answer);
					setTitle(response[0].title);
					setChoices(response[0].choices);
					const plainCode = stripHtmlTags(response[0].code2);
					console.log("response code is ", response[0].code2);
					console.log("plain code is", plainCode);
					setCode(plainCode);
				}
			}
		);
	};

	const customTheme = EditorView.theme({
		"&": {
			fontSize: "16px", // Adjust the font size as needed
		},
	});
	return (
		<div className='relative w-full min-h-screen overflow-y-auto flex flex-col items-center p-10 z-10'>
			<h2 className='text-2xl mt-10'>{title}</h2>

			{code && (
				<CodeMirror
					className='  CodeMirror text-3xl mt-10 line-height-10 '
					value={code}
					// height='700px'
					// width='990px'
					extensions={[cpp(), autocompleteExtension,vim()]}
					theme='dark' // Optional: Choose a theme
					basicSetup={basicSetup}
					onChange={(value) => {
						setCode(value);
					}}
				/>
			)}

			<pre
				className={`aside  ccpp  text-2xl ${editCode ? "hidden" : ""}`}
				onChange={(e) => {
					setCode(e.target.value);
				}}
			>
				<code className='language-cpp'>{code}</code>
			</pre>
			<h1>
				<codapi-snippet
					className='text-2xl'
					sandbox='cpp'
					editor='basic'
				></codapi-snippet>{" "}
				<button
					className='bg-blue-500 text-white p-2 rounded-md m-4'
					onClick={() => setEditCode(false)}
				>
					edit code
				</button>
			</h1>

			{choices.map((choice, index) => {
				const options = choice.split(/ - \\[ \] | - \\[x\\]/);
				return (
					<div key={index} className='space-y-2'>
						{options.map((option, idx) => (
							<button
								key={idx}
								className=' card w-full flex items-center justify-between px-12 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-100 m-4 '
							>
								<span className='text-xl font-semibold'>
									{musicalNote[idx]}
								</span>
								<span className='text-gray-900 items-center font-bold  text-2xl px-4'>
									{option
										.replace(/\\/g, "")
										.replace(/\\[x\\]/g, "")
										.replace(/[\]x]/g, "")
										.trim()}
								</span>
							</button>
						))}
					</div>
				);
			})}

			<button
				className='bg-blue-500 text-white p-2 rounded-md m-4'
				onClick={() => {
					setVariabletoAnswer(true);
				}}
			>
				show answer
			</button>

			<p className='text-2xl m-4 '>{variabletoAnswer ? answer : ""}</p>

			{variabletoAnswer && (
				<button
					className='bg-blue-500 text-black p-2 rounded-md m-4'
					onClick={fetchNextQuestion}
				>
					next question
				</button>
			)}
		</div>
	);
}

export default App2;