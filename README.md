DirtyText
=========

Use styled atomic text-blocks inside an editable text box. These text-blocks behave like single characters when using the text area. 



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
    $(function () {

        var tags = {
            '{my email}': 'my email',
            '{my phone}': 'my phone',
            '{my first name}': 'my first name',
            '{my last name}': 'my last name',
            '{client first name}': 'client first name',
            '{client last name}': 'client last name'
        };

        //For each tag, create a button with the data-key & data-val attributes used by DirtyText.
        //DirtyText can take these buttons and apply the click & drag events used to interact with the text area
        for (var key in tags) {
            $('#menu').append(
                $('<button/>').attr('data-key', key).attr('data-val', tags[key]).text(tags[key])
            );
        }

        $('#template').dirtyText({
            tags: tags,
            menu: $('#menu').children(),
            text: "Hi {client first name} {client last name}, please call me at {my phone}.",
            change: function (text) {
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
 * ```menu```: a jQuery object with elements containing the data-key & data-val attributes. Click and drag events will be added to each element and can then interact with the text area. `default: null`
 * ```change```: callback that returns the parsed changed text. `default : null`


### Methods

 * ```.dirtyText('parse')``` returns the text containing keys.
 * ```.dirtyText('clear')``` empties the text area.
 * ```.dirtyText('set', string)``` populates and renders the text area with a specified string that can contain keys.
 * ```.dirtyText('render')``` renders any key strings as atomic text-blocks (useless if `liveRender` option is true).


### Styling

Styling of the atomic text-blocks can be done by editing the `.dirtyText > hr:after` selector in `dirtytext.css`



### Compatibility

`As of March 2013` Tested and working in latest versions of Chrome, Firefox, Opera (drag & drop unsupported), Safari, and IE8+


License:
-----

__DirtyText__ is released under the MIT license.
