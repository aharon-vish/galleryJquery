$(document).ready(function () {
    var api_key = '346c2b5529f2926ea20aad4cc8c689fc';
    var per_page = 10;
    var method = 'flickr.photos.search';
    var format = 'json';
    var page_index = 0;
    var extras = 'url_sq,url_c';

    var photoArr = new Array();

    function urlRequest(page_index) {
        return 'https://api.flickr.com/services/rest/?'
            + 'method=' + method
            + '&api_key=' + api_key
            + '&format=' + format
            + '&nojsoncallback=1'
            + '&per_page=' + per_page
            + '&page=' + page_index
            + '&text=' + 'cat'
            + '&extras=' + extras;

    }

    getImages();
    function getImages(page_index) {
        if (page_index === undefined) {
            page_index = 0;
        }
        $.ajax({
            url: urlRequest(page_index)
        }).done(function (data) {
            removeElmentFromDom(['.col-md-1', '.jumbotron img']);
            photoArr = [];
            data.photos.photo.map(function (photo) {
                if (photo.url_c && photo.url_sq) {
                    $("<div class='col-md-1'>"
                        + "<a href='#' class='thumbnail' data-id='" + photo.id + "'>"
                        + "<img src='" + photo.url_sq + "' class='img-responsive' data-id='" + photo.id + "'>"
                        + "</a>"
                        + "</div>").appendTo("#thumbNailContainer");
                    photoArr.push(photo);
                }
            });
            $("<img src='" + photoArr[0].url_c + "' class='img-responsive' data-id='" + photoArr[0].id + "'>").appendTo("#bigImageContainer");
            $('#thumbNailContainer .col-md-1 .thumbnail')[0].classList.toggle('thumbNailFocus');

            var thumbNailArr = $('#thumbNailContainer > .col-md-1 a');
            thumbNailArr.map(function (el) {
                $(thumbNailArr[el]).click(thumbNailClick.bind(photoArr, this));
            })
        });
    };

    function removeElmentFromDom(elArray) {
        elArray.map(function (el) {
            $(el).remove()
        });
    }

    function thumbNailClick(photoArr, e) {
        e.preventDefault();
        $('.thumbnail.thumbNailFocus').removeClass('thumbNailFocus');
        e.currentTarget.classList.toggle('thumbNailFocus');
        var imageId = e.currentTarget.dataset.id;
        var imageIdFinder = findEl(imageId);
        var el = this.find(imageIdFinder);
        $('#bigImageContainer .img-responsive').fadeOut("slow",function(){
            $('#bigImageContainer .img-responsive').attr("src", el.url_c);
        }).fadeIn("slow");
    }

    function findEl(a) {
        return function (element) {
            if (element.id === a) {
                return element;
            }
        }
    }

    $('#right').click(function () {
        ++page_index;
        getImages(page_index);
    });

    $('#left').click(function () {
        if (page_index === 0) {
            return this;
        } else {
            --page_index;
            getImages();
        }
    });

});
