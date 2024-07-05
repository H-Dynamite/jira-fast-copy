const domain = document.location.origin;
const token = utils.getCookie("atlassian.xsrf.token");

bindTableChangeEventNew();

function bindTableChangeEventNew() {
  var targetNode = document.querySelector("#ghx-rabid");
  if (targetNode == null) {
    return;
  }
 
  var config = {
    attributes: true,
    attributeFilter: ["class"],
    childList: true,
    subtree: true,
    attributeOldValue: true,
  };

  var callback = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
      
      if (mutation.target.className.includes("ghx-work")) {
        checkDetailView();
      } else if (mutation.target.id === "ghx-plan") {
        checkDetailView();
      } 
    }
  };
  new MutationObserver(callback).observe(targetNode, config);
}


function checkDetailView() {
  const fast_copy = document.getElementById("fast-copy");

  if(fast_copy){
    return;
  }

  var checkCount = 0;
  var maxCheckTimes = 10;
  var intervalId = setInterval(function () {
    if (checkCount++ > maxCheckTimes) {
      clearInterval(intervalId);
      return;
    }
    const ghx_controls_work = document.getElementById("ghx-view-selector");
 
    if (ghx_controls_work) {
      // 创建一个新的按钮元素
      const button = document.createElement("button");
      button.style.float = "right";
      button.setAttribute("id", "fast-copy"); 
      button.textContent = "一键复制"; // 设置按钮文本
      // 为按钮添加点击事件监听器（如果需要）
      button.addEventListener("click", () => {
        var textToCopy =
          document.getElementById("issuekey-val").querySelector("a").innerText +
          " " +
          document.getElementById("summary-val").innerText;
  
        let clipboard = navigator.clipboard || {
          writeText: (text) => {
            let copyInput = document.createElement("input");
            copyInput.value = text;
            document.body.appendChild(copyInput);
            copyInput.select();
            document.execCommand("copy");
            document.body.removeChild(copyInput);
          },
        };
        if (clipboard) {
          clipboard.writeText(textToCopy);
        }
      });
      ghx_controls_work.appendChild(button);
    }
 
    clearInterval(intervalId);
  }, 1000);
}