const targetDate = new Date("2024-12-31T23:59:59").getTime()//여기 날짜 바꾸면 자동계산 됩니

    function startCountdown() {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            // 시간 계산
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // day, hour, min, sec 업데이트
            document.getElementById("days").textContent = days.toString().padStart(2, '0');
            document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
            document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
            
            // span을 다시 추가해 'D', 'H', 'M', 'S' 표시 유지
            document.getElementById("days").innerHTML += '<span>D</span>';
            document.getElementById("hours").innerHTML += '<span>H</span>';
            document.getElementById("minutes").innerHTML += '<span>M</span>';
            document.getElementById("seconds").innerHTML += '<span>S</span>';

            // 타이머가 종료되면 멈추기
            if (distance < 0) {
                clearInterval(interval);
                document.querySelector('.timer').textContent = "Time's up!";
            }
        }, 1000); // 1초마다 실행
    }

    // 페이지 로드 시 카운트다운 시작
    window.onload = startCountdown;
</script>
		
		<script>
    // Total supply and tokens sold definition
    const totalTokens = 3000000000; // Total supply
    let soldTokens = 100000000;     // Tokens sold
    let tokenPrice = 1.00;      // Token price (USD)

    function updatePresaleStatus() {
        // Calculate remaining tokens
        const remainingTokens = totalTokens - soldTokens;
        
        // Calculate sold percentage
        const soldPercentage = (soldTokens / totalTokens) * 100;

        // Update HTML content
        document.getElementById("remaining-tokens").textContent = remainingTokens.toLocaleString();
        document.getElementById("sold-tokens").textContent = soldTokens.toLocaleString();
        document.getElementById("token-price").textContent = tokenPrice.toFixed(2);
        
        // Update progress bar
        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = soldPercentage + "%";
        progressBar.textContent = Math.round(soldPercentage) + "%";
    }

    // Initial status update
    updatePresaleStatus();
