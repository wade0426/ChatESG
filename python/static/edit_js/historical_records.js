function historical_records(title, prompt, generatedResult) {
    // 定義historical_records
    let records = JSON.parse(localStorage.getItem('historical_records')) || [];
    const newRecord = {
        index: records.length + 1,
        title: title,
        prompt: prompt,
        generatedResult: generatedResult
    };

    records.push(newRecord);

    localStorage.setItem('historical_records', JSON.stringify(records));
}