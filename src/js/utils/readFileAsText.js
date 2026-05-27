export default file => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => resolve(event.target.result);
    reader.onerror = () => reject(reader.error);

    reader.readAsText(file);
});
