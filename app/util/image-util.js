export class ImageUtil {
  getRandomImage() {
    let images = ['img/amsterdan.jpg', 'img/india.jpg', 'img/japan.jpg',
      'img/temple.jpg', 'img/temple'];

    let index = Math.floor(Math.random() * (images.length - 1));

    return images[index];
  }
}
