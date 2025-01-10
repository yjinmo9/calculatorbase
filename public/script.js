const formulaInput = document.getElementById("formula-input");
const answerBtn = document.getElementById("answer-btn");
const resultContainer = document.getElementById("result-container");
const historyDiv = document.getElementById("calc-history");

// 버튼 클릭 이벤트
answerBtn.addEventListener("click", async () => {
    const formula = formulaInput.value.trim(); // 입력값 가져오기
    const formulaRegex = /^\d+(\.\d+)?([+\-*/]\d+(\.\d+)?)*$/; // 유효성 검사
    const isValid = formulaRegex.test(formula);

    let resultText = "Invalid Formula";
    if (isValid) {
        try {
            const answer = new Function(`return ${formula}`)(); // 계산
            resultText = `${formula} = ${Number.isInteger(answer) ? answer : answer.toFixed(2)}`;
        } catch (error) {
            resultText = "Error in Calculation";
        }
    }

    // 결과를 화면에 추가
    addResultToContainer(resultText, isValid);

    // 데이터베이스에 저장
    await saveToDatabase({ formula, result: resultText, isValid });

    // 입력란 초기화
    formulaInput.value = "";
});

// 결과를 화면에 추가
function addResultToContainer(resultText, isValid) {
    // 새로운 결과를 추가
    const resultDiv = document.createElement("div");
    resultDiv.textContent = resultText;
    resultDiv.classList.add(isValid ? "valid" : "invalid");
    resultContainer.prepend(resultDiv);

    // 최대 5개까지만 유지
    const resultCount = resultContainer.children.length;
    if (resultCount > 5) {
        resultContainer.removeChild(resultContainer.lastChild);
    }
}

// 서버로 결과 저장
async function saveToDatabase(data) {
    try {
        await fetch("/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Failed to save calculation:", error);
    }
}

