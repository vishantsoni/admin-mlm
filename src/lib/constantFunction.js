// import { getSession } from 'next-auth/react'

let token = ''

// const host = 'http://localhost:5000'

const host = process.env.API_URL || 'http://localhost:5000'

const isFormData = body => {
  return body instanceof FormData
}

export const isUri = string => {
  if (typeof string !== 'string') {
    return false // Not a string, so not a URI
  }

  return (
    string.startsWith('http') || string.startsWith('https') || string.startsWith('ftp') || string.startsWith('file')
  )
}

export const formattedAmount = value => {
  let amount = 0

  if (value >= 1e5) {
    amount = formatInIndianUnits(value)
  } else {
    amount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return amount
}

export function formatInIndianUnits(amount) {
  amount = Number(amount)

  if (amount >= 1e7) {
    return (amount / 1e7).toFixed(2) + ' Cr'
  } else if (amount >= 1e5) {
    return (amount / 1e5).toFixed(2) + ' Lakh'
  } else if (amount >= 1e3) {
    return (amount / 1e3).toFixed(2) + 'K'
  } else {
    return amount.toLocaleString('en-IN')
  }
}

export const getCurrencyIcon = value => {
  return value === 'INR' ? '₹' : ''
}

export const date_formate = isoDate => {
  const date = new Date(isoDate)

  const formatted = date.toLocaleDateString('en-GB') // "15/07/2025"

  return formatted
}

export const time_format = isoDate => {
  const date = new Date(isoDate)

  const formatted = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) // "14:35:22"

  return formatted
}

export const time_diff = (isoDate1, isoDate2, s_time = null, e_time = null) => {
  const date1 = new Date(isoDate1)
  const date2 = new Date(isoDate2)

  // difference in milliseconds
  let diffMs = Math.abs(date2 - date1)

  // base total minutes (decimal allowed)
  let totalMins = diffMs / (1000 * 60)

  // add extra start/end times if provided
  if (s_time) {
    totalMins += parseFloat(s_time.replace('mins', '').trim())
  }

  if (e_time) {
    totalMins += parseFloat(e_time.replace('mins', '').trim())
  }

  // convert to hours and minutes
  const diffHrs = Math.floor(totalMins / 60)
  const diffMins = Math.floor(totalMins % 60)

  return `${diffHrs} hr ${diffMins} min`
}

export const buttonProps = (children, color, variant, sx, icon, size) => ({
  children,
  color,
  variant,
  sx,
  startIcon: icon ? icon : null, // for Button with icon
  size
})

export const buttonIconProps = (icon, color, variant, className) => ({
  icon, // for Chip with icon only
  color,
  variant,
  className,
  sx: {
    borderRadius: '9999px',
    px: 1.5,
    fontSize: '1rem'
  }
})

const serverCallFuction = async (method = 'GET', endPoints = '', body = null) => {
  try {
    // const session = await getSession()

    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    // const token = storedToken ? `Bearer ${storedToken}` : '';
    const token = storedToken ;
    let header = {}

    if (body) {
      if (!isFormData(body)) {
        header = {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      } else {
        header = {
          'x-auth-token': token
        }
      }
    } else {
      header = {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    }

    const requestOptions = {
      method: method,
      headers: header,
      body: body ? (isFormData(body) ? body : JSON.stringify(body)) : null
    }

    console.log('server call function - ', host, endPoints)

    const response = await fetch(`${host}/${endPoints}`, requestOptions)

    const contentType = response.headers.get('content-type')
    let dataresp = null

    // Only try parsing JSON if it's the right content type and not empty
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()

      dataresp = text ? JSON.parse(text) : {}
    }

    // return {
    //   status: response.ok,
    //   statusCode: response.status,
    //   message: response.statusText,
    //   data: dataresp
    // }
    if (response.ok) {
      return dataresp
    } else {
      return { status: false, e_code: response.status, message: 'Something went wrong!' }
    }
  } catch (e) {
    console.log('error in calling endpoint - ', e)

    return {
      status: false,
      message: e.message || 'Something went wrong',
      data: null
    }
  }
}

export default serverCallFuction

export const Decode64 = encoded => {
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')

  return decoded
}

export const Endcode64 = string => {
  const encoded = Buffer.from(string).toString('base64')

  return encoded
}
