DirtyText
=========

Use styled atomic (readonly) text-blocks inside an otherwise editable text box. These text-blocks behave like single characters when using the text area. Highly useful for creating user-friendly templates that contain variables. 

Typically when your users need to insert variables into a textarea when creating a template, you may instruct them to create a string with some syntax such as:

```
Hello {contact first name}, this is {my first name}...
```
However, this may be a confusing and unintuitive user experience for any unsavvy users.
We couldn't find any existing solution for this problem so we created our own!


Example
-----

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
            '{contact first name}': 'contact first name',
            '{contact last name}': 'contact last name'
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
            text: "Hi {contact first name} {client last name}, please call me at {my phone}.",
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
 * ```menu```: a jQuery object of elements with data-key & data-val attributes. Click & drag events are added to each so they interact with the text area. `default: null`
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



How does it work?
-----

A container element (such as a div) is applied the [`contentEditable`](https://developer.mozilla.org/en-US/docs/HTML/Content_Editable) attribute so it can behave like a textarea element and still contain child elements. 

Now lets insert our styled text-block. We could try to insert something like `<span class='variable'>my email</span>`, however, the inner-text is still editable. 

We can create readonly text to overcome this by using the CSS [:after psuedo-element](https://developer.mozilla.org/en-US/docs/CSS/::after) in conjuction with [content: attr()](https://developer.mozilla.org/en-US/docs/CSS/attr)

Now the tricky part is finding a suitable HTML tag which absolutely cannot contain contain any (text nodes)[https://developer.mozilla.org/en-US/docs/Whitespace_in_the_DOM]. 
The tag also needs to be able to properly display as inline-block and allow an :after psuedo-element. We discovered such a holy grail element: the [singlton tag](http://webdesign.about.com/od/htmltags/qt/html-void-elements.htm) `hr`.

Yes, that's right, the good ol' [horizontal rule element](https://developer.mozilla.org/en-US/docs/HTML/Element/hr). 
Thus far, the hr is the only element we have found that works for this purpose. We apply some basic CSS resets to the element and it works like a charm. Who would have though? 


License:
-----

__DirtyText__ is released under the MIT license.
