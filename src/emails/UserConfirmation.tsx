import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface UserConfirmationProps {
  name: string;
}

export const UserConfirmation = ({
  name,
}: UserConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for contacting us</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Reaching Out!</Heading>
          <Section style={section}>
            <Text style={text}>
              Dear {name},
            </Text>
            <Text style={text}>
              Thank you for contacting us. We have received your message and will get back to you as soon as possible.
            </Text>
            <Text style={text}>
              In the meantime, please feel free to check out our website for more information.
            </Text>

            <Hr style={hr} />
            
            <Text style={footer}>
              This is an automated confirmation. Please do not reply to this email.
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
  marginBottom: '20px',
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

export default UserConfirmation;