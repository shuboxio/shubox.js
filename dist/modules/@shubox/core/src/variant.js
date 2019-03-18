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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvdmFyaWFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtJQUlFLGlCQUFZLElBQWdCLEVBQUUsT0FBb0I7UUFBcEIsd0JBQUEsRUFBQSxZQUFvQjtRQUhsRCxVQUFLLEdBQVcsRUFBRSxDQUFBO1FBQ2xCLFlBQU8sR0FBVyxFQUFFLENBQUE7UUFHbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0lBQ3hCLENBQUM7SUFFRCxxQkFBRyxHQUFIO1FBQ0UsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDaEUsSUFBQSw0QkFBK0MsRUFBOUMsZUFBTyxFQUFFLGtCQUFVLENBQTJCO1FBQ25ELElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQTtRQUVwQixXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUMxQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDdEQsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBRTNELE9BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRU8sK0JBQWEsR0FBckIsVUFBc0IsUUFBZ0I7UUFDcEMsT0FBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDeEMsQ0FBQztJQUVPLCtCQUFhLEdBQXJCLFVBQXNCLE1BQWMsRUFBRSxRQUFnQjtRQUNwRCxJQUFHLENBQUMsTUFBTSxFQUFFO1lBQUUsT0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQUU7UUFFaEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQzthQUN2QixPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQzthQUN4QixPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBRXZDLE9BQU0sQ0FBSSxNQUFNLFNBQUksUUFBVSxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVPLGlDQUFlLEdBQXZCLFVBQXdCLFNBQWlCLEVBQUUsUUFBZ0I7UUFDekQsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUFFLE9BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUFFO1FBRXBDLE9BQU0sQ0FBSSxRQUFRLFNBQUksU0FBVyxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBeENELElBd0NDIn0=