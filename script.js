//*current date
var today = new Date();
var yyyy = today.getFullYear();
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var dd = String(today.getDate()).padStart(2, '0');

$('#event_year').val(yyyy);
$('#event_month').val(mm);
$('#event_date').val(dd);


$( "#event_year" ).keyup(function() {
  yyyy = $( this ).val();
})
.keyup();
$( "#event_month" ).keyup(function() {
  mm = $( this ).val();
})
.keyup();
$( "#event_date" ).keyup(function() {
  dd = $( this ).val();
})
.keyup();


//*generate pdf

function generatePDF() {
  $("#sign_table").removeClass("mqcss");
  const rootNode = document.querySelector("#sign_table")
  const opt = {
    // margin: 10,
    filename: '烏鼓吉流行音樂社活動簽到表_' + yyyy + mm + dd + '.pdf',
    jsPDF: { format: 'b4', orientation: 'portrait' }, // 紙張方向
    html2canvas:  { 
      scale: 4, // 與畫面清晰度相關,
      useCORS: true,
      height: 1200,
    }
  }
   
  // 選取要渲染的元素
  const element = rootNode;
  // 匯出 PDF
  html2pdf()
    .set(opt)
    .from(element)
    .save();

}

document.getElementById('exportPDF').addEventListener('click', generatePDF);



//*signIn input window
//signIn toggle
$( "#signCreate" ).click(function() {
  $(".sign_input").show();
});
$("#close").click(function() {
  $(".sign_input").hide();
});


//edit toggle
$("#editTable").click(function(){
  $(".deleteROw").toggle();
});





//*E-signature

(function() {
  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimaitonFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  var canvas = document.getElementById("sig-canvas");
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#222222";
  ctx.lineWidth = 4;

  var drawing = false;
  var mousePos = {
    x: 0,
    y: 0
  };
  var lastPos = mousePos;

  canvas.addEventListener("mousedown", function(e) {
    drawing = true;
    lastPos = getMousePos(canvas, e);
  }, false);

  canvas.addEventListener("mouseup", function(e) {
    drawing = false;
  }, false);

  canvas.addEventListener("mousemove", function(e) {
    mousePos = getMousePos(canvas, e);
  }, false);

  // Add touch event support for mobile
  canvas.addEventListener("touchstart", function(e) {

  }, false);

  canvas.addEventListener("touchmove", function(e) {
    var touch = e.touches[0];
    var me = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(me);
  }, false);

  canvas.addEventListener("touchstart", function(e) {
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var me = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(me);
  }, false);

  canvas.addEventListener("touchend", function(e) {
    var me = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(me);
  }, false);

  function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    }
  }

  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    }
  }

  function renderCanvas() {
    if (drawing) {
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      lastPos = mousePos;
    }
  }

  // Prevent scrolling when touching the canvas
  document.body.addEventListener("touchstart", function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);
  document.body.addEventListener("touchend", function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);
  document.body.addEventListener("touchmove", function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);

  (function drawLoop() {
    requestAnimFrame(drawLoop);
    renderCanvas();
  })();

  // function clearCanvas() {
  //   canvas.width = canvas.width;
  // }
  function clearCanvas(canvas) {
    
    ctx.save();
    ctx.globalCompositeOperation = 'copy';
    ctx.strokeStyle = 'transparent';
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.restore();
  }

  // Set up the UI
  //*add row
  var sigText = document.getElementById("sig-dataUrl");
  // var sigImage = document.getElementById("sig-image");
  var sigImage = document.createElement('img')
  var clearBtn = document.getElementById("sig-clearBtn");
  // var submitBtn = document.getElementById("sig-submitBtn");

  var data = []
  var tbody = document.querySelector('#sign_list')
  var signIn_btn = document.querySelector('#signIn')
  
  signIn_btn.addEventListener('click', () => {
    var inputform = document.querySelector(".sign_input")
    inputform.style.display = 'none';
    var dataNew = []
    var dp = document.querySelector('#department').value
    var dpnum = document.querySelector('#dpnum').value
    var name = document.querySelector('#visitor_name').value
    var worknum = document.querySelector('#worknum').value

    console.log(dataNew);
    if (name !== '' && dpnum !== '' && worknum!== '') {
      dataNew.push(dp)
      dataNew.push(dpnum)
      dataNew.push(name)
      dataNew.push(worknum)
      // dataNew.appendChild(sigImage)

      console.log(dataNew);
      var tr = document.createElement('tr')
      for (var i = 0; i < dataNew.length; i++) {
        var td = document.createElement('td')
        td.innerHTML = dataNew[i]
        tr.appendChild(td)
      }

      var td = document.createElement('td')
      td.className = "deleteROw"
      td.innerHTML = `<a>✖</a>`
      var a = td.children[0]
      a.addEventListener('click', () => {
        var parent = a.parentNode.parentNode
        console.log(parent);
        parent.remove()
      })

      var td2 = document.createElement('td')
      var sigImage = document.createElement('img')
      var dataUrl = canvas.toDataURL()
      td2.appendChild(sigImage)
      sigText.innerHTML = dataUrl;
      sigImage.id="sig-image"
      sigImage.setAttribute("src", dataUrl);

      tr.appendChild(td2)
      tr.appendChild(td)

      console.log(tr);
      tbody.insertBefore(tr, tbody.children[0])
    }
    console.log(tbody.children[0]);
  });
  signIn_btn.addEventListener('click', () => {
    clearCanvas();
    var dp = document.querySelector('#department')
    var dpnum = document.querySelector('#dpnum')
    var name = document.querySelector('#visitor_name')
    var worknum = document.querySelector('#worknum')
    dp.value = "";
    dpnum.value = "";
    name.value = "";
    worknum.value = "";
  });

  clearBtn.addEventListener("click", function(e) {
    clearCanvas();
    // sigText.innerHTML = "Data URL for your signature will go here!";
    // sigImage.setAttribute("src", "");
  }, false);
  // signIn_btn.addEventListener("click", function(e) {
  //   var dataUrl = canvas.toDataURL();
  //   sigText.innerHTML = dataUrl;
  //   sigImage.setAttribute("src", dataUrl);
  // }, false);

})();

