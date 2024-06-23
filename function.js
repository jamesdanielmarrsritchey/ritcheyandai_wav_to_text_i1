document.addEventListener('DOMContentLoaded', function() {
    var inputElement = document.getElementById('wavFileInput');
    if (inputElement) {
        inputElement.addEventListener('change', function() {
            wavToArray(this);
        });
    }
});

function wavToArray(inputElement) {
    if (!inputElement.files || inputElement.files.length === 0) {
        console.log("No file selected.");
        return;
    }

    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const view = new DataView(arrayBuffer);

        const dataStart = 44;
        const audioSamples = [];

        for (let i = dataStart; i < view.byteLength; i += 2) {
            const sample = view.getInt16(i, true);
            audioSamples.push(sample);
        }

        console.log("Audio samples:", audioSamples);
        downloadArrayAsTextFile(audioSamples);
    };

    reader.readAsArrayBuffer(file);
}

function downloadArrayAsTextFile(audioSamples) {
    const text = audioSamples.join(", ");
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'audioSamples.txt';
    document.body.appendChild(a); // Append the anchor to the body to make it clickable
    a.click();

    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Free up memory
}