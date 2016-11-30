var createToken = function () {
    var x = {"grant_type": "password",
             "username": "knupo_test@knupo.com",
             "password": "Password1!"
    };
    $.ajax({
        crossDomain: true
            , type: 'POST'
            , url: "https://immense-badlands-72647.herokuapp.com/oauth/token"
            , contentType: 'application/x-www-form-urlencoded; charset=utf-8'
            , data: "grant_type=password&username=knupo_test@knupo.com&password=Password1!"
            , success: function (data) {
                var token = "Bearer " + data.access_token;
                createTransaction(token, Math.floor(Math.random() * 10) + 1);
            }
            , error: function (errMsg) {
                console.log(errMsg);
            }
    });
};
var drawQRImage = function (transactionId, div) {
    const QRPrefix = 'knupo://sell?id=';
    div = div ? div : 'QRImage';
    $('#' + div).qrcode({
      render: 'image',
      minVersion: 6,
      ecLevel: 'H',
      left: 0,
      top: 0,
      size: 448 ,
      fill: '#000',
      background: null,
      text: QRPrefix + transactionId,
      radius: 0.5,
      quiet: 0,
      mode: 4,
      mSize: 0.2,
      mPosX: 0.5,
      mPosY: 0.5,
      image: $('#img-buffer')[0]
      });
};
var drawSuccessTransaction = function (div) {
    div = div ? div : 'QRImage';
    $('#' + div).html('<img width=256 height=256 src="success.png"/>');
};
var getTransaction = function (token, transactionId) {
    var fetchingLoop = setInterval(function () {
        $.ajax({
            crossDomain: true
            , type: 'GET'
            , url: 'http://knupo.herokuapp.com/transactions/' + transactionId
            , headers: {
                'Authorization': token
            }
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , success: function (data) {
                if (data.status == 'APPROVED') {
                    clearInterval(fetchingLoop);
                    drawSuccessTransaction('QRImage');
                }
                else {
                    console.log(data);
                }
            }
            , error: function (errMsg) {
                console.log(errMsg);
            }
        });
    }, 1000);
};
var createTransaction = function (token, amount) {
    var x = {
        'amount': amount
    };
    $.ajax({
        headers: {
            'Authorization': token
        }
        , crossDomain: true
        , type: 'POST'
        , url: 'http://knupo.herokuapp.com/transactions'
        , data: JSON.stringify(x)
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , success: function (data) {
            drawQRImage(data.id, 'QRImage');
            getTransaction(token,data.id);
        }
        , error: function (errMsg) {
            console.log(errMsg);
        }
    });
};
$(function () {
    createToken()
});
