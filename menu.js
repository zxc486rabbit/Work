document.addEventListener("DOMContentLoaded", function() {
  const stickyList = document.getElementById('stickyList');
  const header = document.getElementById('header');
  const listItems = document.querySelectorAll('#stickyList li');
  const sections = document.querySelectorAll('h3.title');
  const stickyOffset = stickyList.offsetTop;

  let manualScroll = false; // 用於追蹤是否正在進行手動滾動
  let scrollTimeout; // 用於延遲滾動事件的處理

  // 預設將「義大利麵」設為 active
  listItems[0].classList.add('active');

  // 處理滾動和固定的 sticky menu 列表
  window.addEventListener('scroll', () => {
    // Sticky navigation
    if (window.pageYOffset >= stickyOffset) {
      stickyList.classList.add('sticky');
    } else {
      stickyList.classList.remove('sticky');
    }

    if (!manualScroll) {
      clearTimeout(scrollTimeout); // 清除之前的 timeout
      scrollTimeout = setTimeout(() => { // 設定新的 timeout
        // 更新 active 狀態
        let current = "義大利麵";
        sections.forEach((section, index) => {
          const sectionTop = section.offsetTop - 100;
          
          if (window.pageYOffset >= sectionTop) {
            current = section.textContent.trim();
          }
        });

        // 更新列表中的 active 狀態
        listItems.forEach((li) => {
          li.classList.remove("active");
          if (li.textContent.trim() === current) {
            li.classList.add("active");
          }
        });
      }, 100); // 延遲 100ms 執行，防止頻繁切換 active 狀態
    }
  });

  // 處理點擊事件
  listItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // 手動滾動開始
      manualScroll = true;

      // 移除所有項目的 active 狀態
      listItems.forEach(i => i.classList.remove('active'));
      // 為點擊的項目添加 active 狀態
      item.classList.add('active');

      // 滾動到對應的區塊
      sections[index].scrollIntoView({ behavior: 'smooth' });

      // 手動滾動結束後，取消 manualScroll 狀態
      setTimeout(() => {
        manualScroll = false;
      }, 500); // 等待滾動結束後（500ms）再允許自動更新 active
    });
  });
});