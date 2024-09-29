function historical_records(prompt, generatedResult) {
    // 定義historical_records
    let records = JSON.parse(localStorage.getItem('historical_records')) || [];
    const newRecord = {
        index: records.length + 1,
        prompt: prompt,
        generatedResult: generatedResult
    };

    records.push(newRecord);

    localStorage.setItem('historical_records', JSON.stringify(records));
}