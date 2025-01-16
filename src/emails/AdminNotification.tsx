import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from '@react-email/components';
import { ContactSubmission } from '@/types/messages';

interface AdminNotificationProps {
  submission: ContactSubmission;
  dashboardUrl: string;
}

export const AdminNotification = ({
  submission,
  dashboardUrl,
}: AdminNotificationProps) => {
  const previewText = `New message from ${submission.full_name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Section style={section}>
            <Text style={text}>
              You have received a new message from {submission.full_name}.
            </Text>
            
            <Section style={messageBox}>
              <Text style={label}>From:</Text>
              <Text style={value}>{submission.full_name} ({submission.email})</Text>
              
              <Text style={label}>Subject:</Text>
              <Text style={value}>{submission.subject}</Text>
              
              <Text style={label}>Message:</Text>
              <Text style={value}>{submission.message}</Text>
            </Section>

            <Button
              href={dashboardUrl}
              style={button}
            >
              View in Dashboard
            </Button>

            <Hr style={hr} />
            
            <Text style={footer}>
              This is an automated notification. You can reply directly to this email
              or use the dashboard to respond.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#484848',
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
};

const messageBox = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const label = {
  color: '#666666',
  fontSize: '14px',
  marginBottom: '4px',
};

const value = {
  color: '#484848',
  fontSize: '16px',
  marginBottom: '16px',
};

const button = {
  backgroundColor: '#5850ec',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px 0',
  margin: '20px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  textAlign: 'center' as const,
};

export default AdminNotification;