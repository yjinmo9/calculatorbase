const formulaInput = document.getElementById("formula-input");
const answerBtn = document.getElementById("answer-btn");
const historyDiv = document.getElementById("calc-history");

const MAX_HISTORY = 5; // 최대 기록 개수

// 버튼 클릭 이벤트
answerBtn.addEventListener("click", async () => {
    const formula = formulaInput.value.trim(); // 입력된 수식 가져오기
    const formulaRegex = /^\d+(\.\d+)?([+\-*/]\d+(\.\d+)?)*$/; // 유효한 수식인지 확인
    const isValid = formulaRegex.test(formula);

    let resultText = "Invalid Formula";
    if (isValid) {
        try {
            const answer = new Function(`return ${formula}`)(); // 계산 수행
            resultText = `${formula} = ${Number.isInteger(answer) ? answer : answer.toFixed(2)}`;
        } catch (error) {
            resultText = "Error in Calculation";
        }
    }

    // 화면에 결과 표시
    addResultToHistory(resultText, isValid);

    // 서버로 결과 전송
    await saveToDatabase({ formula, result: resultText, isValid });

    // 입력 초기화
    formulaInput.value = "";
});

// 결과를 화면에 추가 (최대 5개로 제한)
function addResultToHistory(resultText, isValid) {
    const resultDiv = document.createElement("div");
    resultDiv.textContent = resultText;
    resultDiv.classList.add(isValid ? "valid" : "invalid");

    // 최신 결과를 맨 위에 추가
    historyDiv.prepend(resultDiv);

    // 결과 기록(div 요소)만 선택
    const historyItems = historyDiv.querySelectorAll("div");

    // 기록이 MAX_HISTORY를 초과하면 가장 오래된 기록 삭제
    if (historyItems.length > MAX_HISTORY) {
        historyDiv.removeChild(historyItems[historyItems.length - 1]); // 가장 오래된 div 제거
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


