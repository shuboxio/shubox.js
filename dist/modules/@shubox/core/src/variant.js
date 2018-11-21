var Variant = /** @class */ (function () {
    function Variant(file, variant) {
        if (variant === void 0) { variant = ""; }
        this.success = false;
        this.s3url = "";
        this.variant = "";
        this.s3url = file.s3url;
        this.variant = variant;
    }
    Variant.prototype.url = function () {
        var variant = this.variant
            .replace(/\#$/, "_hash")
            .replace(/\^$/, "_carat")
            .replace(/\!$/, "_bang");
        var filename = this.s3url.substring(this.s3url.lastIndexOf('/') + 1);
        var variantFilename = variant + "_" + filename.replace(/\+/g, '%2B');
        return (this.s3url.replace(filename, variantFilename));
    };
    return Variant;
}());
export { Variant };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvdmFyaWFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtJQUtFLGlCQUFZLElBQWdCLEVBQUUsT0FBb0I7UUFBcEIsd0JBQUEsRUFBQSxZQUFvQjtRQUpsRCxZQUFPLEdBQVksS0FBSyxDQUFBO1FBQ3hCLFVBQUssR0FBVyxFQUFFLENBQUE7UUFDbEIsWUFBTyxHQUFXLEVBQUUsQ0FBQTtRQUdsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDeEIsQ0FBQztJQUVELHFCQUFHLEdBQUg7UUFDRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTzthQUN2QixPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQzthQUN2QixPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQzthQUN4QixPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBRTFCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3BFLElBQUksZUFBZSxHQUFNLE9BQU8sU0FBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUcsQ0FBQTtRQUVwRSxPQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUE7SUFDdkQsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDIn0=