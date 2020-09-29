function checkUser(){
    document.getElementById("loader-view").style.display="none";
}

function onSubmitClick(){
    loadUserData();
}
function loadUserData(page){
    var selectedUser = document.getElementById("user-select");
    var xhttp = new XMLHttpRequest();
    var url =  page == undefined ? "https://jsonmock.hackerrank.com/api/transactions?userId="+ selectedUser.value : "https://jsonmock.hackerrank.com/api/transactions?userId="+ selectedUser.value + "&page="+page;
    xhttp.onreadystatechange = function() {
        document.getElementById("loader-view").style.display="block";
        document.getElementById("monthly-statements").innerHTML = "";
        document.getElementById("user-balance").innerHTML = "";
        document.getElementById("user-name").innerHTML ="";
       
        if (this.readyState == 4 && this.status == 200) {
        document.getElementById("user-name").innerHTML = selectedUser[selectedUser.value].text;
        var data = JSON.parse(this.responseText).data;
        document.getElementById("user-balance").innerHTML = getBalance(data);
          for(var i= 0; i<  data.length ; i++){
              var statementDiv = document.createElement("div");
              statementDiv.style.margin = "10px";
              statementDiv.style.padding="10px";
              statementDiv.style. border = "1px solid grey";
              statementDiv.innerHTML = data[i].amount + "<br />"+ data[i].location.address +"<br />"+ data[i].location.city;
              document.getElementById("monthly-statements").append(statementDiv)
          }
          if(!page){
            document.getElementById("pagination").innerHTML ="";
            for(var i= 1; i<=  JSON.parse(this.responseText).total_pages ; i++){
                var paginationEl = document.createElement("a");
                paginationEl.innerHTML = "<a onClick='onPaginationClick("+i+")'>" + i + "</a>";
                document.getElementById("pagination").append(paginationEl);
            }
          }
          document.getElementById("loader-view").style.display="none";
        }
      };
    if(selectedUser != -1){
        xhttp.open("GET", url, true);
        xhttp.send();
    }
}
function onPaginationClick(i){
    loadUserData(i)
}
function getBalance(data){
    var creditBalance = 0,
        debitBalance = 0;
    data.forEach(e => {
        if(e.txnType == "debit"){
            debitBalance = debitBalance +  Number(e.amount.replace(/[^0-9.-]+/g,""));
        }else if ( e.txnType == "credit"){
            creditBalance = creditBalance +  Number(e.amount.replace(/[^0-9.-]+/g,""));
        }
    });
    return creditBalance - debitBalance;

}