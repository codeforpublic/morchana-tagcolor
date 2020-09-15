const crypto = require('crypto')
const https = require('https')

class morchana {
  constructor () {
    this.apiEndpoint = 'https://api.dev.thaialert.com'
    this.apiHeaders = {
      'Content-Type': 'application/json',
      'X-TH-ANONYMOUS-ID': 'xxx',
      'X-TH-API-KEY':
        'IduVaB1GSJw3PIakpB0pZWHSrFRdwX35qRS6P8c5urk8SAECQQD5h9iTopR79220'
    }
    const scheme = new URL(this.apiEndpoint)
    this.host = scheme.hostname
  }

  request (options, postData) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let buffer = ''
        res.on('data', (chunk) => (buffer += chunk))
        res.on('end', () => resolve(buffer))
      })
      req.on('error', (e) => {
        // reject(new Error(e))
        reject(e)
      })
      if (postData) {
        req.write(postData)
      }
      req.end()
    })
  }

  hashedPhoneNumber (phoneNumber) {
    return crypto.createHash('sha256').update(phoneNumber).digest('hex')
  }

  anonymousIdByHashedPhoneNumber (body) {
    const options = {
      method: 'GET',
      host: this.host,
      path: '/admin/anonymousIdByHashedPhoneNumber?hashedPhoneNumber=' + body,
      headers: this.apiHeaders
    }
    return this.request(options)
  }

  assignUserTag (body) {
    const options = {
      method: 'POST',
      host: this.host,
      path: '/admin/assignUserTag',
      headers: this.apiHeaders
    }
    body = {
      tagId: body.tagId,
      anonymousId: body.anonymousId
    }
    console.log('====')
    console.log(body)
    return this.request(options, JSON.stringify(body))
  }

  createTag (body) {
    const options = {
      method: 'POST',
      host: this.host,
      path: '/admin/createTag',
      headers: this.apiHeaders
    }
    body = {
      id: body.id ? body.id.trim().toUpperCase() : '',
      title: body.title ? body.title.trim() : '',
      tagRoleId: body.tagRoleId ? body.tagRoleId.trim().toUpperCase() : ''
    }
    return this.request(options, JSON.stringify(body))
  }

  tags () {
    const options = {
      method: 'GET',
      host: this.host,
      path: '/tags',
      headers: this.apiHeaders
    }
    return this.request(options)
  }
}

module.exports = morchana
