"use client"

/**
 * Safe clipboard utility that handles permissions and fallbacks
 */
export async function safeClipboardWrite(text: string): Promise<boolean> {
  try {
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      console.warn('Clipboard API not available')
      return fallbackCopyTextToClipboard(text)
    }

    // Check permissions
    const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName })
    
    if (permission.state === 'denied') {
      console.warn('Clipboard write permission denied')
      return fallbackCopyTextToClipboard(text)
    }

    // Try to write to clipboard
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.warn('Clipboard write failed:', error)
    return fallbackCopyTextToClipboard(text)
  }
}

/**
 * Fallback method using document.execCommand (deprecated but still works)
 */
function fallbackCopyTextToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    return successful
  } catch (error) {
    console.error('Fallback clipboard copy failed:', error)
    return false
  }
}

/**
 * Safe clipboard read utility
 */
export async function safeClipboardRead(): Promise<string | null> {
  try {
    if (!navigator.clipboard) {
      console.warn('Clipboard API not available for reading')
      return null
    }

    const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName })
    
    if (permission.state === 'denied') {
      console.warn('Clipboard read permission denied')
      return null
    }

    const text = await navigator.clipboard.readText()
    return text
  } catch (error) {
    console.warn('Clipboard read failed:', error)
    return null
  }
}
