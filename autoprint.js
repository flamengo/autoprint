try {
	var page = require('webpage').create(), jqueryPath = 'jquery.js', fs = require('fs'), files = fs.list('img'), imgs = [];
	for (var i = 0, ii = files.length, j = 1; i < ii; i++)
		if (/[A-Za-z]+\.[A-Za-z]+/.test(files[i])) {
			imgs.push(files[i]);
			console.log(j++ + ': ' + files[i]);
		}
	page.paperSize = {
		format : 'A4',
		orientation : 'portrait',
		margin : '1cm'
	};
	var content = '', template = '<html><body><style>table{page-break-before:always;width:100%;}tr{width:100%;}td{text-align:center;max-width:820px;min-height:20px;}img{width:100%;}.rotate{-webkit-transform:rotate(90deg);height:100%;width:auto;}</style><table>###imgs###</table></body></html>';
	for (var i = 0, ii = imgs.length; i < ii; i++) {
		if (!(i % 3) && i)
			content += '</table><table>';
		content += '<tr><td><img src="img/' + imgs[i] + '"></td><td><img src="img/' + imgs[i] + '"></td></tr>';
	}
	fs.write('autoprint.html', template.replace('###imgs###', content), 'w');
	fs.remove('autoprint.pdf');
	page.open('autoprint.html', function(status) {
		if (status !== 'success') {
			console.log('Unable to load the address!');
			phantom.exit();
		} else {
			page.injectJs(jqueryPath);
			page.evaluate(function() {
				$('img').each(function() {
					if ($(this).width() < $(this).height())
						$(this).addClass('rotate');
				});
			});
			page.render('autoprint.pdf');
			fs.remove('autoprint.html');
			phantom.exit();
		}
	});
} catch(e) {
	console.log('Error: ' + (e.message || e));
	phantom.exit();
}
