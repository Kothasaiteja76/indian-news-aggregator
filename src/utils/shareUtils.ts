export const shareArticle = async (article: {
    title: string;
    url: string;
    description?: string;
  }) => {
    const shareData = {
      title: article.title,
      text: article.description || article.title,
      url: article.url,
    };
  
    // Check if Web Share API is supported (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.log('Web Share cancelled:', error);
      }
    }
  
    // Fallback: Copy to clipboard
    try {
      const shareText = `${article.title}\n\n${article.description || ''}\n\nRead more: ${article.url}`;
      await navigator.clipboard.writeText(shareText);
      
      // Show success message
      alert('Article link copied to clipboard! 📋\nYou can now paste it anywhere to share.');
      return true;
    } catch (error) {
      console.error('Clipboard failed:', error);
      
      // Final fallback: Open share dialog
      const subject = encodeURIComponent(article.title);
      const body = encodeURIComponent(
        `${article.description || article.title}\n\nRead more: ${article.url}`
      );
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      return true;
    }
  };