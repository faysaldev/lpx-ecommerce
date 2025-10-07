/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";

const ShareProductButton = ({ product }: any) => {
  // URL for sharing (dynamically created for product)
  const productUrl = `/product/${product._id}`;

  // The message or content that will be shared (this can be customized)
  const shareMessage = `${
    product.productName
  } - ${product.description.substring(0, 100)}... Check it out!`;

  return (
    <div>
      <h2>Share this product</h2>

      {/* Facebook Share Button */}
      <FacebookShareButton
        url={window.location.origin + productUrl}
        hashtag="#productshare"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      {/* Twitter Share Button */}
      <TwitterShareButton
        url={window.location.origin + productUrl}
        title={shareMessage}
        hashtags={["productshare"]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      {/* WhatsApp Share Button */}
      <WhatsappShareButton
        url={window.location.origin + productUrl}
        title={shareMessage}
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      {/* LinkedIn Share Button */}
      <LinkedinShareButton
        url={window.location.origin + productUrl}
        title={shareMessage}
        summary={product.description}
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareProductButton;
