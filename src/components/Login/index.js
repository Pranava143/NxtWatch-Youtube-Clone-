import {Component} from 'react'
import Cookies from 'js-cookie'
import {
  LoginFormContainer,
  LoginCardForm,
  Logo,
  Input,
  Label,
  ShowPasswordContainer,
  LoginButton,
  ShowPassword,
  ErrorMessage,
} from './styledComponents'

class Login extends Component {
  state = {
    showError: false,
    showErrorMsg: '',
    password: '',
    username: '',
  }

  componentDidMount() {
    this.checkAuthentication()
  }

  checkAuthentication = () => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const {history} = this.props
      history.replace('/')
    }
  }

  showPassword = () => {
    const show = document.getElementById('password')
    if (show.type === 'password') {
      show.type = 'text'
    } else {
      show.type = 'password'
    }
  }

  setUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  setPassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  successResponse = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      path: '/',
      expires: 30,
    })
    history.replace('/')
  }

  failureResponse = errorMsg => {
    this.setState({
      showError: true,
      showErrorMsg: errorMsg,
    })
  }

  ValidateCredentials = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const res = await fetch(url, options)
    const data = await res.json()
    if (res.ok === true) {
      this.successResponse(data.jwt_token)
    } else {
      this.failureResponse(data.error_msg)
    }
  }

  render() {
    const {showError, showErrorMsg} = this.state
    return (
      <LoginFormContainer>
        <LoginCardForm onSubmit={this.ValidateCredentials}>
          <Logo
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
          />
          <Label htmlFor="username" theme="true">
            USERNAME
          </Label>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            onChange={this.setUsername}
          />
          <Label htmlFor="password" theme="true">
            PASSWORD
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            onChange={this.setPassword}
          />
          <ShowPasswordContainer>
            <ShowPassword
              type="checkbox"
              id="showPassword"
              value="Show Password"
              onClick={this.showPassword}
            />
            <Label theme="true" htmlFor="showPassword">
              Show Password
            </Label>
          </ShowPasswordContainer>
          <Label theme="true">
            <strong>Username: </strong>rahul
            <br /> Password: rahul@2021
          </Label>
          <LoginButton type="submit"> Login</LoginButton>

          {showError ? <ErrorMessage>*{showErrorMsg}</ErrorMessage> : ''}
        </LoginCardForm>
      </LoginFormContainer>
    )
  }
}

export default Login
