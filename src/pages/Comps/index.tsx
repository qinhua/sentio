import { useState } from 'react'
import { Space, Button } from 'antd-mobile'
import Drawer from '@/components/common/Drawer'
import Dialog from '@/components/common/Dialog'
import { DemoBlock } from './DemoBlock'

const PageComps = () => {
  const [showDrawer, setShowDrawer] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className="page-comps" style={{ paddingBottom: '90px' }}>
      <DemoBlock title="Button">
        <Space direction="vertical">
          <DemoBlock title="Color" marginBottom="0">
            <Space wrap style={{ '--gap': '12px' }}>
              <Button color="default">Default</Button>
              <Button color="primary">Primary</Button>
              <Button color="warning">Warning</Button>
              <Button color="danger">Danger</Button>
              <Button color="success">Success</Button>
            </Space>
          </DemoBlock>

          <DemoBlock title="Disabled" marginBottom="0">
            <Space wrap style={{ '--gap': '12px' }}>
              <Button color="default" disabled>
                Default
              </Button>
              <Button color="primary" disabled>
                Primary
              </Button>
              <Button color="warning" disabled>
                Warning
              </Button>
              <Button color="danger" disabled>
                Danger
              </Button>
            </Space>
          </DemoBlock>

          <DemoBlock title="Size" marginBottom="0">
            <Space wrap style={{ '--gap': '12px' }}>
              <Button size="mini" color="primary">
                Mini
              </Button>
              <Button size="small" color="primary">
                Small
              </Button>
              <Button size="middle" color="primary">
                Middle
              </Button>
              <Button size="large" color="primary">
                Large
              </Button>
            </Space>
          </DemoBlock>
        </Space>
      </DemoBlock>

      <DemoBlock title="Drawer">
        <Button onClick={() => setShowDrawer(true)}>Open Drawer</Button>
      </DemoBlock>

      <DemoBlock title="Popup">
        <Button onClick={() => setShowDialog(true)}>Open Popup</Button>
      </DemoBlock>

      {/* Drawer */}
      <Drawer
        visible={showDrawer}
        title="Drawer"
        onClose={() => {
          setShowDrawer(false)
        }}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut in autem
        sit accusantium quod minus assumenda, beatae sunt pariatur molestias.
        Eum ipsam quibusdam reprehenderit labore facere atque laudantium quidem
        vitae.
      </Drawer>

      {/* Dialog */}
      <Dialog
        visible={showDialog}
        title="Dialog"
        onClose={() => {
          setShowDialog(false)
        }}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut in autem
        sit accusantium quod minus assumenda, beatae sunt pariatur molestias.
        Eum ipsam quibusdam reprehenderit labore facere atque laudantium quidem
        vitae.
      </Dialog>
    </div>
  )
}

export default PageComps
