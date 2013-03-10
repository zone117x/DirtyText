DirtyText
=========

Custom atomic text-blocks inside an editable text box.



Example
-------

View a demonstration at http://shared.zone117x.com/dirtyText/example.html

Usage
-----
```html
  <head>
    <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>

    <script src="dirtytext.js"></script>
    <link rel="stylesheet" href="dirtytext.css"/>
	</head>
	<body>
    <div id="menu"></div>
		<div id="template"></div>
    <div id="preview"></div>
	</body>
	<script type="text/javascript">
	$(function(){
		        var tags = {
            '{my email}': 'my email',
            '{my phone}': 'my phone',
            '{my first name}': 'my first name',
            '{my last name}': 'my last name',
            '{client first name}': 'client first name',
            '{client last name}': 'client last name'
        };


        for (var key in tags) {
            $('#menu').append($('<button/>').attr('data-key', key).attr('data-val', tags[key]).text(tags[key]));
        }

        var initialText = "Hi {client first name} {client last name}, please call me at {my phone}.";

        $('#template').dirtyText({
            tags: tags,
            menu: $('#menu').children(),
            text: initialText,
            change: function(text){
                $('#preview').text(text);
            }
        });
	})
	</script>
```


### Options

The options that you can set are:

 * ```tags```: a key-value object used to build each atomic text-block. `required`
 * ```liveRender```: if true, any manually entered keys will be automatically rendered. `default: true`
 * ```text```: initial text that can contain keys which will be rendered to be  `default : ''`
 * ```menu```: a jQuery object with elements containing the data-key & data-val attributes. `default: null`
 * ```change```: callback that returns the parsed changed text. `default : null`

***
### Methods

 * ```.dirtyText('parse')``` returns the text containing keys.
 * ```.dirtyText('clear')``` empties the text area.
 * ```.dirtyText('set', string)``` populates and renders the text area with a specified string that can contain keys.
 * ```.dirtyText('render')``` renders any key strings as atomic text-blocks (useless if `liveRender` option is true).


***
### License:

__DirtyText__ is released under the MIT license.
