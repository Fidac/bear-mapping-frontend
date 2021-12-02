import React from 'react';
import {Icon, Layout, Menu} from "antd";
import 'antd/dist/antd.css';
import {Link} from "react-router-dom";
// import '../App/App.css';
// import '../static/css/main.css';

const {Header, Content, Footer, Sider} = Layout;

const LayoutWrapper = (WrappedComponent) => {
     class LayoutWrapper extends React.Component {
        render() {
            return (
                <Layout>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                    >
                        <div className="logo slider-header">Bear Mapping</div>
                        <Menu theme="dark" mode="inline">
                            <Menu.Item key="1">
                                <Link to="/" >
                                    <Icon type="home"/>
                                    <span className="nav-text">Home</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/creation" >
                                    <Icon type="form"/>
                                    <span className="nav-text">Create</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="8">
                                <Link to="/login">
                                    <Icon type="form"/>
                                    <span className="nav-text">Logout</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header className="header" style={{background: '#e6f7ff', padding: 0}}>
                            <span>Bear Mapping</span>
                        </Header>
                        <Content className="content" style={{margin: '24px 16px 0'}}>
                            <WrappedComponent {...this.props}/>
                        </Content>
                        <Footer className="footer" style={{textAlign: 'center'}}>Bear Mapping</Footer>
                    </Layout>
                </Layout>
            );
        }
    }
    LayoutWrapper.displayName = `LayoutWrapper(${getDisplayName(WrappedComponent)})`;
     return LayoutWrapper;
};

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default LayoutWrapper;
