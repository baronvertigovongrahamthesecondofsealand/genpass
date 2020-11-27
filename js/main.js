jQuery(function($) {

    var alg, filecontents, file;

    $('.drop-file').on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }).on('dragenter', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }).on('drop', function(e) {
        doFileHandle(e, e.originalEvent.dataTransfer.files);
    }).on('click', function(e) {
        $('.uploader').click();
    });

    $('.drop-file .reset').on('click', function(e) {
        e.stopPropagation();

        filecontents = null;
        file = null;

        $('.uploader').val(null);

        doHash();
    });

    $('.uploader').on('change', function(e) {
        doFileHandle(e, $(this).prop('files'));
    });

    $('.alg').on('change', function(e) {
        alg = $('.alg').val();
        doHash();
    }).trigger('change');

    function doFileHandle(e, files) {
        if (files && files.length) {
            e.preventDefault();
            e.stopPropagation();

            file = files[0];

            if (file) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function() {
                    $('.drop-file').addClass('active');
                    $('.preview').attr('src', reader.result).show();
                    filecontents = $('.preview').attr('src').slice($('.preview').attr('src').indexOf(',') + 1);

                    doHash();
                };

                reader.onerror = function (evt) {
                    $('.result .hash').text("error reading file");
                    $('.result').show();
                    return;
                };
            } else {
                $('.result .hash').text("error uploading file");
                $('.result').show();
                return;
            }

            filecontents = null;
        }
    }

    function doHash() {
        var crypto = new jsSHA(alg, 'B64');

        if (filecontents) {
            crypto.update(filecontents);

            $('.result .hash').text(crypto.getHash('HEX'));
            $('.result').show();
        } else {
            $('.drop-file .preview').attr('src', null).hide();
            $('.drop-file').removeClass('active');
            $('.result').hide();
        }
    }

});
