document.addEventListener("DOMContentLoaded", function () {
  // stickyList 上面選擇列表
  const stickyList = document.getElementById("stickyList");
  // header 整個navbar
  const header = document.getElementById("header");
  // listItems 上面選擇列表的各個品項
  const listItems = document.querySelectorAll("#stickyList li");
  // sections 每個段落的關鍵字 h3.title
  const sections = document.querySelectorAll("h3.title");
  const stickyOffset = stickyList.offsetTop;
  // console.log(stickyOffset)

  let manualScroll = false; // 用於追蹤是否正在進行手動滾動
  let scrollTimeout; // 用於延遲滾動事件的處理

  // 預設將「義大利麵」設為 active
  listItems[0].classList.add("active");

  // 處理滾動和固定的 sticky menu 列表
  window.addEventListener("scroll", () => {
    // Sticky navigation
    if (window.pageYOffset >= stickyOffset) {
      stickyList.classList.add("sticky");
    } else {
      stickyList.classList.remove("sticky");
    }

    if (!manualScroll) {
      clearTimeout(scrollTimeout); // 清除之前的 timeout
      scrollTimeout = setTimeout(() => {
        // 設定新的 timeout
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
    item.addEventListener("click", () => {
      // 手動滾動開始
      manualScroll = true;

      // 移除所有項目的 active 狀態
      listItems.forEach((i) => i.classList.remove("active"));
      // 為點擊的項目添加 active 狀態
      item.classList.add("active");
      // 計算目標 section 的位置並考慮 stickyList 的高度進行偏移
      const sectionTop =
        sections[index].offsetTop - stickyList.offsetHeight - 100;
      // 滾動到對應的區塊，並考慮偏移量
      window.scrollTo({ top: sectionTop, behavior: "smooth" });

      // 手動滾動結束後，取消 manualScroll 狀態
      setTimeout(() => {
        manualScroll = false;
      }, 500); // 等待滾動結束後（500ms）再允許自動更新 active
    });
  });

  // 取得按鈕和彈出框的元素
  // 初始化變數
  const addToCartButtons = document.querySelectorAll(".addCart");
  const cartButton = document.getElementById("cart-button");
  const cartCountDisplay = document.getElementById("cart-count");
  const cartSidebar = document.getElementById("cart-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const closeSidebarButton = document.getElementById("close-sidebar");
  const cartItemsContainer = document.getElementById("cart-items");
  const closeBtn = document.getElementById("close-btn");
  let cartItems = []; // 儲存購物車商品的數組
  let cartCount = 0;

  // 點擊 "加入購物車" 按鈕時添加商品到購物車
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const productCard = button.closest(".card");
      const productName = productCard
        .querySelector(".card-title")
        .textContent.trim();
      const productImage = productCard.querySelector(".product-image").src;
      const productDescription = productCard
        .querySelector(".card-text")
        .textContent.trim();

      cartSidebar.classList.remove("show");
      sidebarOverlay.classList.remove("show");

      // 將商品資訊添加到購物車數組中
      cartItems.push({
        name: productName,
        image: productImage,
        description: productDescription,
      });

      // 顯示彈出框
      modal.style.display = "block";
      overlay.style.display = "block";

      // 3秒後自動關閉彈出框
      setTimeout(() => {
        modal.style.display = "none";
        overlay.style.display = "none";
      }, 3000);

      // 關閉彈出框
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        overlay.style.display = "none";
      });

      // 增加購物車圖示的動畫效果
      cartButton.classList.add("bounce");
      cartButton.addEventListener(
        "animationend",
        () => {
          cartButton.classList.remove("bounce");
        },
        { once: true }
      );

      // 更新購物車數量
      cartCount += 1;
      cartCountDisplay.textContent = cartCount;
    });
  });

  // 點擊購物車圖示時顯示或隱藏側邊欄
  cartButton.addEventListener("click", () => {
     // 檢查購物車是否為空
  if (cartItems.length > 0) {
    // 檢查側邊欄是否已經顯示
    if (cartSidebar.classList.contains("show")) {
      // 側邊欄已顯示，將其隱藏
      cartSidebar.classList.remove("show");
      sidebarOverlay.classList.remove("show");
    } else {
      // 側邊欄未顯示，更新內容並顯示
      updateCartSidebar(); // 更新側邊欄中的購物車內容
      cartSidebar.classList.add("show");
      sidebarOverlay.classList.add("show");
    }
  }else {
    // 當購物車為空時顯示提示
    Swal.fire({
      title: "您的購物車目前是空的",
      icon: "info",
      confirmButtonText: "確定",
      customClass: {
        popup: "custom-swal-popup",
      },
    });
  }
});

  // 點擊關閉按鈕或遮罩時隱藏側邊欄
  closeSidebarButton.addEventListener("click", () => {
    cartSidebar.classList.remove("show");
    sidebarOverlay.classList.remove("show");
  });

  sidebarOverlay.addEventListener("click", () => {
    cartSidebar.classList.remove("show");
    sidebarOverlay.classList.remove("show");
  });

  // 更新側邊欄中的購物車內容
  function updateCartSidebar() {
    cartItemsContainer.innerHTML = ""; // 清空側邊欄內容
    cartItems.forEach((item, index) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
       <div class="cart-item-image">
         <img src="${item.image}" alt="${item.name}">
       </div>
       <div class="cart-item-details">
         <h5>${item.name}</h5>
         <div class="d-flex justify-content-between align-items-center">
         <p>${item.description}</p>
         <i class="bi bi-trash3-fill trash data-index="${index}""></i>
         </div>
       </div>
     `;
      // 將生成的購物車項目元素添加到側邊欄容器中
      cartItemsContainer.appendChild(cartItemElement);
    });

    // 為所有垃圾桶圖標添加點擊事件
    document.querySelectorAll(".trash").forEach((trashIcon) => {
      trashIcon.addEventListener("click", function () {
        const index = this.getAttribute("data-index");  // 正確獲取索引

        document.querySelector(".sidebar-overlay").style.display = "none"; // 關閉側邊欄遮罩

        // 使用 SweetAlert2 顯示確認提示框
        Swal.fire({
          title: "確定要移除該品項嗎？",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          scrollbarPadding: false, // 保持滾動條可見，防止隱藏滾動條  
          customClass: {
            popup: 'custom-swal-popup', // 自定義樣式類
          },
          // 當 SweetAlert 打開時隱藏側邊欄
  didOpen: () => {
    cartSidebar.classList.remove("show");
        sidebarOverlay.classList.remove("show");
  },
  // // 當 SweetAlert 關閉時顯示側邊欄
  didClose: () => {
    cartSidebar.classList.add("show");
        sidebarOverlay.classList.add("show");
  }
        })
          .then((result) => {
            if (result.isConfirmed) {
               // 關閉側邊欄或做其他操作
               
              deleteCartItem(index); // 如果用戶確認，則刪除項目
              // 更新購物車數量
              cartCount -= 1;
              cartCountDisplay.textContent = cartCount;
              if (cartCount === 0) {
                cartCount = 0;
              }
            }
          })
      });
    });
  }
  // 刪除購物車項目函數
  function deleteCartItem(index) {
    cartItems.splice(index, 1); // 刪除指定索引的項目
    updateCartSidebar(); // 更新側邊欄

    // 檢查購物車是否為空
    if (cartItems.length === 0) {
      Swal.fire({
        title: "您的購物車目前是空的",
        icon: "info",
        confirmButtonText: "確定",
        customClass: {
          popup: "custom-swal-popup", // 使用自定義樣式類
        },
      }).then(() => {
        // 在確認購物車清空後，移除側欄的顯示狀態並重置
        cartSidebar.classList.remove("show");
        sidebarOverlay.classList.remove("show");
        
        // 確保購物車圖示恢復正常狀態
        cartButton.classList.remove("bounce");
        
      });
    }
  }


  //  RWD nav列表
   document.getElementById('menuButton').addEventListener('click', function() {
  const headerUl = document.querySelector('.headerUl');
  if (headerUl.style.display === 'none' || headerUl.style.display === '') {
    headerUl.style.display = 'block';
  } else {
    headerUl.style.display = 'none';
  }
});

// 當窗口尺寸改變時檢查螢幕寬度
window.addEventListener('resize', function() {
  const headerUl = document.querySelector('.headerUl');
  if (window.innerWidth > 768) {
    headerUl.style.display = ''; // 恢復預設顯示
  }
});
  

// 獲取當前頁面的路徑
const currentPage = window.location.pathname;

// 獲取所有的導航連結
const navLinks = document.querySelectorAll('.headerUl a');

// 迭代每個連結，並檢查是否與當前頁面匹配
navLinks.forEach(link => {
  if (link.href.includes(currentPage)) {
    link.classList.add('active');
  }

  // 在小於768px的螢幕上，當鼠標懸停在active的連結上時，移除active
  link.addEventListener('mouseover', () => {
    if (window.innerWidth < 768) {
      link.classList.remove('active');
    }
  });
});

document.querySelector('.top').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
});
});
