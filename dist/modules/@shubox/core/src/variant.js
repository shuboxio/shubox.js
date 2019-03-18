var Variant = /** @class */ (function () {
    function Variant(file, variant) {
        if (variant === void 0) { variant = ""; }
        this.s3url = "";
        this.variant = "";
        this.s3url = file.s3url;
        this.variant = variant;
    }
    Variant.prototype.url = function () {
        var filename = this.s3url.substring(this.s3url.lastIndexOf("/") + 1);
        var _a = this.variant.split("."), vPrefix = _a[0], vExtension = _a[1];
        var newFilename = "";
        newFilename = this.cleanFilename(filename);
        newFilename = this.variantPrefix(vPrefix, newFilename);
        newFilename = this.variantFiletype(vExtension, newFilename);
        return (this.s3url.replace(filename, newFilename));
    };
    Variant.prototype.cleanFilename = function (filename) {
        return (filename.replace(/\+/g, "%2B"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvdmFyaWFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtJQUlFLGlCQUFZLElBQWlCLEVBQUUsT0FBb0I7UUFBcEIsd0JBQUEsRUFBQSxZQUFvQjtRQUg1QyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFHMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFTSxxQkFBRyxHQUFWO1FBQ0UsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBQSw0QkFBK0MsRUFBOUMsZUFBTyxFQUFFLGtCQUFxQyxDQUFDO1FBQ3RELElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUVyQixXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdkQsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTVELE9BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU8sK0JBQWEsR0FBckIsVUFBc0IsUUFBZ0I7UUFDcEMsT0FBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVPLCtCQUFhLEdBQXJCLFVBQXNCLE1BQWMsRUFBRSxRQUFnQjtRQUNwRCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsT0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQUU7UUFFbEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQzthQUN2QixPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQzthQUN4QixPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXhDLE9BQU0sQ0FBSSxNQUFNLFNBQUksUUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVPLGlDQUFlLEdBQXZCLFVBQXdCLFNBQWlCLEVBQUUsUUFBZ0I7UUFDekQsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUFFLE9BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUFFO1FBRXJDLE9BQU0sQ0FBSSxRQUFRLFNBQUksU0FBVyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBeENELElBd0NDIn0=