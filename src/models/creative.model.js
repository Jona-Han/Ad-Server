class Creative {
  constructor(advertiserID, title, width, height, imageName, imageLink, clickUrl, altText) {
    this.advertiserID = advertiserID;
    this.title = title;
    this.width = width;
    this.height = height;
    this.imageName = imageName;
    this.imageLink = imageLink;
    this.clickUrl = clickUrl;
    this.altText = altText;
  }

  // You can add methods here if needed, e.g., to validate data or perform additional actions.

  // Static method to create a Creative instance from a database result
  static fromDatabaseResult(result) {
    return new Creative(
      result.advertiserID,
      result.title,
      result.width,
      result.height,
      result.imageName,
      result.imageLink,
      result.clickUrl,
      result.altText,
    );
  }
}

module.exports = Creative;
