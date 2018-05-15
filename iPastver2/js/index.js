var themes = {
	'Alien Goo': {
		textColor: 0xEEC344,
		bgColor: 0x2C4452,
		highlightColor: 0xD95040,
		altColor: 0xDF6F38,
		disabledColor: 0x3EAA92,
		lineColor: 0x3DFF93,
		background: 0x212529
	},
	'Ocean Cantaloupe': {
		textColor: 0xFE794F,
		bgColor: 0xF6F3D2,
		highlightColor: 0x1D2B30,
		altColor: 0xABD8C5,
		disabledColor: 0xFFB693,
		lineColor: 0x3584A0,
		background: 0xDAF1F7
	},
	'Chinch': {
		textColor: 0x122D5A,
		bgColor: 0xFFCE34,
		highlightColor: 0xE43700,
		altColor: 0xF18000,
		disabledColor: 0xFFA000,
		lineColor: 0x0D618F,
		background: 0xB2B4BE
	},
	'Neighborhood Café': {
		textColor: 0xECF6F8,
		bgColor: 0x634D4C,
		highlightColor: 0x7FAF68,
		altColor: 0xB8C28B,
		disabledColor: 0xC2BCAB,
		lineColor: 0xFF7500,
	},
	'Corporate Blue': {
		textColor: 0xFFFFFF,
		bgColor: 0x2D3F6C,
		highlightColor: 0xFF4D00,
		altColor: 0xFFA977,
		disabledColor: 0xD6E8F7,
		lineColor: 0x85BFD6,
	},
	'Show Seeker': {
		textColor: 0xFFD200,
		bgColor: 0x8B643C,
		highlightColor: 0x007BDC,
		altColor: 0x00A5BC,
		disabledColor: 0x212F44,
		lineColor: 0xFF9B00,
		background: 0x212529
	},
	'Azure Red': {
		textColor: 0xF6F3DA,
		bgColor: 0x005B60,
		highlightColor: 0xFF3500,
		altColor: 0xFF7D00,
		disabledColor: 0x403E40,
		lineColor: 0x009896,
		background: 0xDAFFD9
	},
	'Neon': {
		textColor: 0xFFFFFF,
		bgColor: 0x7100EF,
		highlightColor: 0xFF00A5,
		altColor: 0xEF00ED,
		disabledColor: 0xBC00FF,
		lineColor: 0x4100FF,
		background: 0xCAC1FF
	}
};

function begin(form, params) {
  if ($(form).isValid({},{},true)) {
    var inp = $("#input").val();
    window.location.href = "main.html?height="+inp+(params?("&"+params):"");
  }
}
function beginTheme(theme) {
  if ( themes && themes[theme] ) {
    var params = $.param( themes[theme] );
    begin($('#form')[0], params);
  }
}

function loadThemes(id, cls) {
	var body = $(id);
	var wrapper = "<a"+(cls?(' class="'+cls+'"'):"")+"></a>";
	for (var theme in themes) {
		var element = $(wrapper);
		element.html(theme);
		element.attr('onclick', 'beginTheme("'+theme+'")');
		body.append(element);
	}
}