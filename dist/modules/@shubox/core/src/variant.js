var Variant = /** @class */ (function () {
    function Variant(file, variant) {
        if (variant === void 0) { variant = ""; }
        this.s3url = "";
        this.variant = "";
        this.s3url = file.s3url;
        this.variant = variant;
    }
    Variant.prototype.url = function () {
        var filename = this.s3url.substring(this.s3url.lastIndexOf('/') + 1);
        var _a = this.variant.split("."), vPrefix = _a[0], vExtension = _a[1];
        var newFilename = "";
        newFilename = this.cleanFilename(filename);
        newFilename = this.variantPrefix(vPrefix, newFilename);
        newFilename = this.variantFiletype(vExtension, newFilename);
        return (this.s3url.replace(filename, newFilename));
    };
    Variant.prototype.cleanFilename = function (filename) {
        return (filename.replace(/\+/g, '%2B'));
    };
    Variant.prototype.variantPrefix = function (prefix, filename) {
        if (!prefix) {
            return (filename);
        }
        prefix = prefix.replace(/\#$/, "_hash")
            .replace(/\^$/, "_carat")
            .replace(/\!$/, "_bang");
        return (prefix + "_" + filename);
    };
    Variant.prototype.variantFiletype = function (extension, filename) {
        if (!extension) {
            return (filename);
        }
        return (filename + "." + extension);
    };
    return Variant;
}());
export { Variant };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvdmFyaWFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtJQUlFLGlCQUFZLElBQWdCLEVBQUUsT0FBb0I7UUFBcEIsd0JBQUEsRUFBQSxZQUFvQjtRQUhsRCxVQUFLLEdBQVcsRUFBRSxDQUFBO1FBQ2xCLFlBQU8sR0FBVyxFQUFFLENBQUE7UUFHbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0lBQ3hCLENBQUM7SUFFRCxxQkFBRyxHQUFIO1FBQ0UsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDaEUsSUFBQSw0QkFBK0MsRUFBOUMsZUFBTyxFQUFFLGtCQUFVLENBQTJCO1FBQ25ELElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQTtRQUVwQixXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUMxQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDdEQsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBRTNELE9BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRU8sK0JBQWEsR0FBckIsVUFBc0IsUUFBUTtRQUM1QixPQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0lBRU8sK0JBQWEsR0FBckIsVUFBc0IsTUFBTSxFQUFFLFFBQVE7UUFDcEMsSUFBRyxDQUFDLE1BQU0sRUFBRTtZQUFFLE9BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUFFO1FBRWhDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7YUFDdkIsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7YUFDeEIsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUV2QyxPQUFNLENBQUksTUFBTSxTQUFJLFFBQVUsQ0FBQyxDQUFBO0lBQ2pDLENBQUM7SUFFTyxpQ0FBZSxHQUF2QixVQUF3QixTQUFTLEVBQUUsUUFBUTtRQUN6QyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQUUsT0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQUU7UUFFcEMsT0FBTSxDQUFJLFFBQVEsU0FBSSxTQUFXLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUF4Q0QsSUF3Q0MifQ==