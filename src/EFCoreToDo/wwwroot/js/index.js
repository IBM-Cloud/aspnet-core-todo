// index.js

var REST_DATA = 'api/db';
var KEY_ENTER = 13;

function loadItems() {
    xhrGet(REST_DATA + '/GetAll', function (data) {
        document.getElementById("loading").innerHTML = "";
        var receivedItems = data || [];
        var items = [];
        var i;
        // Make sure the received items have correct format
        for (i = 0; i < receivedItems.length; ++i) {
            var item = receivedItems[i];
            if (item && '_id' in item && 'text' in item) {
                items.push(item);
            }
        }
        for (i = 0; i < items.length; ++i) {
            addItem(items[i], false);
        }
    }, function (err) {
        console.error(err);
        document.getElementById("loading").innerHTML = "ERROR";
    });
}

function addItem(item, isNew) {
    var row = document.createElement('tr');
    var id = item && item._id;
    var rev = item && item._rev;
    if (id) {
        row.setAttribute('data-id', id);
    }
    row.innerHTML = "<td style='width:90%'><textarea onchange='saveChange(this)' onkeydown='onKey(event)'></textarea></td>" +
		"<td class='deleteBtn' onclick='deleteItem(this)' title='delete me'></td>";
    var table = document.getElementById('notes');
    console.log(table.lastChild);
    table.lastChild.appendChild(row);
    var textarea = row.firstChild.firstChild;
    if (item) {
        textarea.value = item.text;
    }
    row.isNew = !item || isNew;
    textarea.focus();
}

function deleteItem(deleteBtnNode) {
    var row = deleteBtnNode.parentNode;
    row.parentNode.removeChild(row);
    xhrDelete(REST_DATA + '/Delete' + '?id=' + row.getAttribute('data-id') + "&text=" + row.getAttribute('data-text'), function () {
    }, function (err) {
        console.error(err);
    });
}

function onKey(evt) {
    if (evt.keyCode == KEY_ENTER && !evt.shiftKey) {
        evt.stopPropagation();
        evt.preventDefault();
        var row = evt.target.parentNode.parentNode;
        if (row.nextSibling) {
            row.nextSibling.firstChild.firstChild.focus();
        } else {
            addItem();
        }
    }
}

function saveChange(contentNode, callback) {
    var row = contentNode.parentNode.parentNode;
    var id = row.getAttribute('data-id');
    var text = contentNode.value;
    id = id == null ? "" : id;
    var data = {
        id: id,
        text: text
    };
    if (row.isNew) {
        delete row.isNew;
        xhrPost(REST_DATA + '/Create', data, function (item) {
            row.setAttribute('data-id', item.id);
            row.setAttribute('data-text', item.text);
            callback && callback();
        }, function (err) {
            console.error(err);
        });
    } else {
        xhrPut(REST_DATA + '/Update', data, function () {
            console.log('updated: ', data);
        }, function (err) {
            console.error(err);
        });
    }
}

function toggleServiceInfo() {
    var node = document.getElementById('dbserviceinfo');
    node.style.display = node.style.display == 'none' ? '' : 'none';
}

loadItems();
