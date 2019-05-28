var Index = function () {
    var modelNum = 1;
    var index = 1;
    var init = function () {
        console.log("init");
        while (modelNum <= 5) {
            addModel();
        }

    };

    var addModel = function () {
        console.log("addModel");
        $("#table_foot").before("<tr class='table_body'>" +
            "<td id='no_" + modelNum + "'></td>" +
            "<td id='category_" + modelNum + "'></td>" +
            "<td> <input id='model_" + modelNum + "' class='input_model' autocomplete='off' onchange='Index.calculationAmount()'/></td>" +
            "<td id='introduce_" + modelNum + "'></td>" +
            "<td id='picture_" + modelNum + "'></td>" +
            "<td id='install_" + modelNum + "'></td>" +
            "<td id='qty_" + modelNum + "'><input id='qty_input_" + modelNum + "'  type='text' class='input_clean text-center font-size-16' onchange='Index.calculationAmount()'/></td>" +
            "<td id='price_" + modelNum + "'></td>" +
            "<td id='discount_" + modelNum + "'><input id='discount_input_" + modelNum + "'  type='text' class='input_clean text-center font-size-16' onchange='Index.calculationAmount()'/></td>" +
            "</tr>");
        $("#model_" + modelNum).bigAutocomplete({
            data: modelData,
            title: 'model',
            callback: function (row, param) {
                selectModel(row, param);
            },
            param: modelNum
        });
        modelNum = modelNum + 1;
    };

    var selectModel = function (row, param) {
        if ($("#no_" + param).html() == "") {
            $("#no_" + param).html(index);
            index = index + 1;
        }
        $("#category_" + param).html(row.category);
        $("#introduce_" + param).html(row.introduce);
        $("#picture_" + param).html("<img src='./img/product/" + row.model + ".png'/>");
        $("#install_" + param).html("<img src='./img/product/" + row.model + "_install.png'/>");
        $("#qty_input_" + param).val(1);
        $("#price_" + param).html(row.price);
        $("#discount_input_" + param).val(row.discount);
        calculationAmount();
    };

    var calculationAmount = function () {
        var amount = 0;
        var trs = $('.table_body');
        for (var i = 0; i < trs.length; i++) {
            var qtyTd = $(trs[i]).find("td")[6];
            var qtyInput = $(qtyTd).find("input")[0];
            var discountTd = $(trs[i]).find("td")[8];
            var discountInput = $(discountTd).find("input")[0];
            var qty = $(qtyInput).val().trim() == '' ? 0 : $(qtyInput).val().trim();
            var discount = $(discountInput).val().trim() == '' ? 0 : $(discountInput).val().trim();
            amount = Math.round(amount + qty * discount);
            if(amount==0){
                return;
            }
            /*console.log(amount);
            console.log(truantoDX(amount));*/
            $("#amount").html(truantoDX(amount)+"(￥"+amount+")");
        }
    };


    var truantoDX = function (n) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "数据非法";
        var unit = "千百拾亿千百拾万千百拾元角分", str = "";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    };

    var createPDF = function (){
        $(".button_div").hide();
        $("body,html").scrollTop(0);
        html2canvas(document.body, {
            background : '#ffffff',
            dpi: 600,//导出pdf清晰度
            scale:2,
            onrendered:function(canvas) {
                var contentWidth = canvas.width;
                var contentHeight = canvas.height;
                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 595.28 * 841.89;
                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //pdf页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 555.28;
                var imgHeight = 555.28/contentWidth * contentHeight;
                var pageData = canvas.toDataURL('image/jpeg', 1.0);
                var pdf = new jsPDF('', 'pt', 'a4');
                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight );
                } else {
                    while(leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if(leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }
                //document.body.appendChild(canvas)

                //var fileName = getNowFormatDate()+"("+$("#customer_name").val()+"-"+$("#customer_mobile").val()+").pdf";
                var fileName = "报价单-"+getNowFormatDate();
                if($("#customer_name").val().trim()!=""){
                    fileName=fileName+"-"+$("#customer_name").val();
                }
                if($("#customer_mobile").val().trim()!=""){
                    fileName=fileName+"-"+$("#customer_mobile").val();
                }
                fileName=fileName+".pdf";
                pdf.save(fileName);
            }
        });
        $(".button_div").show();
    };

    var getNowFormatDate=function() {
        var date = new Date();
        //var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        //var currentdate = year + seperator1 + month + seperator1 + strDate;
        var currentdate = year + "年" + month + "月" + strDate+"日";
        return currentdate;
    }
    return {
        init: init,
        addModel: addModel,
        calculationAmount: calculationAmount,
        createPDF:createPDF
    }
}();


$(function () {
    Index.init();
});

