const vscode = require("vscode");

function showImage(editor) {
	const decorationType = vscode.window.createTextEditorDecorationType({
		before: {
			contentText: " ", // Ensure content exists so the decoration can be applied
			textDecoration:
				'none; position: absolute; width: 100px; height: 100px; background-size: contain; background-repeat: no-repeat; background-image: url("https://w7.pngwing.com/pngs/723/728/png-transparent-iron-man-iron-man-s-superhero-fictional-character-film-thumbnail.png");',
		},
	});

	const position = editor.selection.active;
	const range = new vscode.Range(position, position);
	editor.setDecorations(decorationType, [range]);

	setTimeout(() => {
		decorationType.dispose();
	}, 5000); // Remove the decoration after 5 seconds
}

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"extension.showImage",
		() => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				showImage(editor);
			}
		}
	);

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
